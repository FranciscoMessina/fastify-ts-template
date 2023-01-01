import { Migration } from '@mikro-orm/migrations';

export class Migration20230101183132 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "email" varchar(100) not null, "password" varchar(255) not null, "updated_at" timestamptz(0) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
