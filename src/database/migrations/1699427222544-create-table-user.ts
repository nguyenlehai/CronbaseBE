import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1592555965808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'fullName',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'ip',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'otp',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'tinyInt',
            isNullable: true,
            default: 1,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
