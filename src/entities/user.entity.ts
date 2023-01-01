import { Property } from '@mikro-orm/core';
import { OptionalProps } from '@mikro-orm/core';
import { Unique } from '@mikro-orm/core';
import { Entity } from '@mikro-orm/core';
import { CustomEntity } from './base.entity';

@Entity()
export class User extends CustomEntity {
  [OptionalProps]?: 'updatedAt' | 'createdAt';

  @Unique()
  @Property({ type: 'varchar', length: 100 })
  email!: string;

  @Property({
    hidden: true,
  })
  password!: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
