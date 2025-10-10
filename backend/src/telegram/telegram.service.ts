import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telegraf, Context } from 'telegraf';
import { Response } from '../entities/response.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;
  private channelId: string;
  private userStates: Map<number, { waitingForResponse: boolean; question: string }> = new Map();
  
  private readonly questions = [
    "What book are you currently reading?",
    "How many pages did you read today?",
    "What's the most interesting thing you've learned so far?",
    "Are you on track with your reading goals?",
    "Would you recommend this book to others? Why or why not?",
  ];
  
  private currentQuestionIndex = 0;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.channelId = this.configService.get<string>('TELEGRAM_CHANNEL_ID');
    
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    }
    
    this.bot = new Telegraf(token);
    this.setupHandlers();
  }

  async onModuleInit() {
    try {
      await this.bot.launch();
      this.logger.log('✅ Telegram bot started successfully');
      this.logger.log(`📢 Channel ID: ${this.channelId}`);
      this.logger.log('⏰ Check-in questions will be sent every 5 minutes');
    } catch (error) {
      this.logger.error('Failed to start Telegram bot:', error);
    }
  }

  private setupHandlers() {
    // Handle /start command
    this.bot.command('start', (ctx) => {
      ctx.reply(
        '👋 Welcome to the Book Reading Check-in Bot!\n\n' +
        'I will send you questions about your reading progress every 5 minutes.\n' +
        'Simply reply to my questions, and your responses will be recorded.\n\n' +
        'Commands:\n' +
        '/start - Show this welcome message\n' +
        '/status - Check bot status'
      );
    });

    // Handle /status command
    this.bot.command('status', (ctx) => {
      ctx.reply('✅ Bot is active and running!\nNext check-in question coming soon...');
    });

    // Handle text messages (responses to questions)
    this.bot.on('text', async (ctx) => {
      const userId = ctx.from.id;
      const userState = this.userStates.get(userId);

      if (userState && userState.waitingForResponse) {
        await this.saveResponse(ctx, userState.question);
        this.userStates.delete(userId);
      }
    });
  }

  // Send check-in questions every 5 minutes
  @Cron('*/5 * * * *') // Every 5 minutes
  async sendCheckInQuestion() {
    if (!this.channelId) {
      this.logger.warn('Channel ID not configured. Skipping check-in question.');
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;

    try {
      await this.bot.telegram.sendMessage(
        this.channelId,
        `📚 Reading Check-in Time!\n\n${question}\n\nPlease reply with your answer.`,
      );
      this.logger.log(`📤 Sent question to channel: ${question}`);
    } catch (error) {
      this.logger.error('Failed to send message to channel:', error);
    }
  }

  private async saveResponse(ctx: Context, question: string) {
    if (!('text' in ctx.message)) return;

    const response = new Response();
    response.userId = ctx.from.id;
    response.username = ctx.from.username || 'unknown';
    response.firstName = ctx.from.first_name || 'Unknown';
    response.lastName = ctx.from.last_name || '';
    response.question = question;
    response.answer = ctx.message.text;

    try {
      await this.responseRepository.save(response);
      await ctx.reply('✅ Thank you! Your response has been recorded.');
      this.logger.log(`💾 Saved response from user ${response.username}`);
    } catch (error) {
      this.logger.error('Failed to save response:', error);
      await ctx.reply('❌ Sorry, there was an error saving your response. Please try again.');
    }
  }

  async onModuleDestroy() {
    await this.bot.stop();
    this.logger.log('Telegram bot stopped');
  }
}

