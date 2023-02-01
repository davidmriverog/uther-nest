import { DynamicModule, Module } from "@nestjs/common"

import { UtherAsyncOptions, UtherOptions } from "../interfaces/uther/uther-option.interface"

@Module({})
export class UtherCoreModule {

  public static forRoot(options: UtherOptions): DynamicModule {


    return {
      module: UtherCoreModule,
      providers: [

      ],
      exports: [

      ],
    }
  }

  public static forRootAsync(options: UtherAsyncOptions): DynamicModule {

    return {
      module: UtherCoreModule,
      providers: [
        ...(options.extraProviders || []),
      ],
      imports: options.imports,
      exports: [
        // ..
      ],
    };
  }

}