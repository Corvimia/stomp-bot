import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  INTEGER,
  Model,
  Sequelize,
  STRING,
  TEXT
} from "sequelize";

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: true,
  // SQLite only
  storage: 'database.sqlite',
});

interface QuoteModel extends Model<InferAttributes<QuoteModel>, InferCreationAttributes<QuoteModel>> {
  id: CreationOptional<number>;
  content: string;
  user: string;
  added_by: string;
  channelId: string;
  messageId: string;
  guildId: string;
}

export const Quote = sequelize.define<QuoteModel>('Quote', {
  id: {
    primaryKey: true,
    type: INTEGER.UNSIGNED,
  },
  content: TEXT,
  user: STRING,
  added_by: STRING,
  channelId: STRING,
  messageId: STRING,
  guildId: STRING,
});

