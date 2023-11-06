import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wanted1698745525132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`CREATE TABLE \`users\`
                       (
                           \`id\`             bigint                                  NOT NULL AUTO_INCREMENT,
                           \`username\`       varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                           \`password\`       varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                           \`is_recommended\` tinyint(1)                              NOT NULL DEFAULT '0',
                           \`latitude\`       double                                           DEFAULT NULL,
                           \`longitude\`      double                                           DEFAULT NULL,
                           \`created_at\`     timestamp                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           \`updated_at\`     timestamp                               NULL     DEFAULT NULL,
                           PRIMARY KEY (\`id\`),
                           UNIQUE KEY \`username\` (\`username\`)
                       ) ENGINE = InnoDB
                         DEFAULT CHARSET = utf8mb4
                         COLLATE = utf8mb4_unicode_ci;`);
    queryRunner.query(`CREATE TABLE \`restaurants\`
                       (
                           \`id\`                    bigint                                  NOT NULL AUTO_INCREMENT,
                           \`place_name\`            varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                           \`business_type\`         varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                           \`business_state\`        tinyint(1)                              NOT NULL,
                           \`road_name_address\`     varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                           \`city_name\`             varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                           \`latitude\`              double                                  NOT NULL,
                           \`longitude\`             double                                  NOT NULL,
                           \`view_count\`            bigint                                  NOT NULL DEFAULT '0',
                           \`total_rating\`          double                                  NOT NULL DEFAULT '0',
                           \`license_date\`          varchar(100) COLLATE utf8mb4_unicode_ci NULL     DEFAULT NULL,
                           \`close_date\`            varchar(50) COLLATE utf8mb4_unicode_ci  NULL     DEFAULT NULL,
                           \`location_area\`         varchar(50) COLLATE utf8mb4_unicode_ci           DEFAULT NULL,
                           \`waterworks_name\`       varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
                           \`male_employee_count\`   bigint                                           DEFAULT NULL,
                           \`female_employee_count\` bigint                                           DEFAULT NULL,
                           \`year\`                  varchar(20) COLLATE utf8mb4_unicode_ci           DEFAULT NULL,
                           \`is_multi_use\`          varchar(100) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
                           \`grade_name\`            varchar(100) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
                           \`total_facility_scale\`  varchar(100) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
                           \`surrounding_area_name\` varchar(100) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
                           \`industry_type\`         varchar(100) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
                           \`total_employee_count\`  bigint                                           DEFAULT NULL,
                           \`lot_number_address\`    varchar(200) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
                           \`zip_code\`              varchar(30) COLLATE utf8mb4_unicode_ci           DEFAULT NULL,
                           \`city_code\`             varchar(50) COLLATE utf8mb4_unicode_ci           DEFAULT NULL,
                           \`created_at\`            timestamp                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           \`updated_at\`            timestamp                               NULL     DEFAULT NULL,
                           PRIMARY KEY (\`id\`),
                           UNIQUE KEY \`UQ_PLACE_NAME_ROAD_NAME_ADDRESS\` (\`place_name\`, \`road_name_address\`)
                       ) ENGINE = InnoDB
                         DEFAULT CHARSET = utf8mb4
                         COLLATE = utf8mb4_unicode_ci;`);
    queryRunner.query(`CREATE TABLE \`reviews\`
                       (
                           \`id\`            bigint                                  NOT NULL AUTO_INCREMENT,
                           \`user_id\`       bigint                                  NOT NULL,
                           \`restaurant_id\` bigint                                  NOT NULL,
                           \`rating\`        double                                  NOT NULL,
                           \`content\`       varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                           \`created_at\`    timestamp                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           \`updated_at\`    timestamp                               NULL     DEFAULT NULL,
                           PRIMARY KEY (\`id\`),
                           KEY \`reviews_FK_02\` (\`restaurant_id\`),
                           KEY \`reviews_FK_01\` (\`user_id\`),
                           CONSTRAINT \`reviews_FK_01\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
                           CONSTRAINT \`reviews_FK_02\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurants\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT
                       ) ENGINE = InnoDB
                         DEFAULT CHARSET = utf8mb4
                         COLLATE = utf8mb4_unicode_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reviews\`
          DROP FOREIGN KEY \`reviews_FK_01\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reviews\`
          DROP FOREIGN KEY \`reviews_FK_02\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`restaurants\``);
    await queryRunner.query(`DROP TABLE \`reviews\``);
  }
}
