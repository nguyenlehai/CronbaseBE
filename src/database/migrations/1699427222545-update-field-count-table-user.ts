import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const _tableName = 'users';
export class CreateFiledUsersTable1592555965809 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      _tableName,
      new TableColumn({
        name: 'twofa',
        type: 'varchar',
        length: '8',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(_tableName, 'count');
  }
}
