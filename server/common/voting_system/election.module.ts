import { Module } from '@nestjs/common';
import { ElectionService } from '@/common/voting_system/election.service';

@Module({
  providers: [ElectionService],
})
export class ElectionModule {}
