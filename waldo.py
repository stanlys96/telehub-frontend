import logging
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

# Your bot token here
TOKEN = '2047210369:AAEAvx4wUMzhRahkKG7qgH-ZB6FYOKW9Wk0'

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Hello! Use /getnews to fetch the latest news.')

def get_news(update: Update, context: CallbackContext) -> None:
    # Here you would normally call the API to get the messages from the channel
    # This is a placeholder for demonstration purposes
    news = "This is the latest news from the channel!"
    update.message.reply_text(news)

def main() -> None:
    # Create the Updater and pass it your bot's token.
    updater = Updater(TOKEN)

    # Get the dispatcher to register handlers
    dispatcher = updater.dispatcher

    # Register handlers
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("getnews", get_news))

    # Start the Bot
    updater.start_polling()

    # Run the bot until you press Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT
    updater.idle()

if __name__ == '__main__':
    main()