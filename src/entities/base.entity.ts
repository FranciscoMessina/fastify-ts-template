import { BeforeCreate } from '@mikro-orm/core';
import { Property } from '@mikro-orm/core';
import { PrimaryKey } from '@mikro-orm/core';
import { generateId } from '../utils/generate-id';

export abstract class CustomEntity {
  @PrimaryKey({
    type: 'varchar',
  })
  id!: string;

  @Property({ type: 'date' })
  createdAt = new Date();

  @BeforeCreate()
  private async _generateId() {
    this.id = await generateId();
  }
}
