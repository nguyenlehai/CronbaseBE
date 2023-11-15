import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from 'typeorm';

const _tableName = 'user_ips';
const _tableUsers = 'users';
export class CreateTableIP1592555965812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: _tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'count', type: 'int', isNullable: false },
          { name: 'userId', type: 'int', isNullable: false },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      _tableName,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: _tableUsers,
        onDelete: 'CASCADE', // Nếu user bị xóa, các dòng liên quan cũng sẽ bị xóa
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa bảng 'ips'
    await queryRunner.dropTable(_tableName);
  }
}
