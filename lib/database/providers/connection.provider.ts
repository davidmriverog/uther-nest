import { DataSource, getMetadataArgsStorage } from "typeorm"
import { ConfigService } from "@nestjs/config"
import { config } from "dotenv"
import { SnakeNamingStrategy } from "../../orm/strategies/snake-naming-strategy"

config()

const configService = new ConfigService()

export const DatabaseProvider = [
  {
    provide: DataSource,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: +configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASS"),
        database: configService.get("DB_DATABASE"),
        entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
        synchronize: Boolean(configService.get("BD_SYNCHRONIZE")),
        logging: Boolean(configService.get("DB_LOGGING")),
        namingStrategy: new SnakeNamingStrategy()
      })

      try {
        console.log(`Load database at ${new Date()} Logging[${configService.get("DB_LOGGING")}] Sync[${configService.get("BD_SYNCHRONIZE")}]`)
        if (!dataSource.isInitialized) {
          await dataSource.initialize()
        }
      } catch (error) {
        console.error(error?.message)
      }

      return dataSource
    },
  },
]