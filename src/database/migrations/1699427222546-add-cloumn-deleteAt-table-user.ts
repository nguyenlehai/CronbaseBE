import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const _tableName = 'users';
export class CreateFiledUsersTable1592555965811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      _tableName,
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.addColumn(
      _tableName,
      new TableColumn({
        name: 'timeLogin',
        type: 'timestamp',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(_tableName, 'deletedAt');
    await queryRunner.dropColumn(_tableName, 'timeLogin');
  }
}
