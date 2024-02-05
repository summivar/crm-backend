import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system/file-system.service';

@Module({
  providers: [FileSystemService],
  exports: [FileSystemService],
})
export class CommonModule {}
