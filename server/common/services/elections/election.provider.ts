import { Provider } from '@nestjs/common';
import { ElectionService } from '@/common/services/elections/election.service';
import { ElectionTypeEnum } from '@/types/election/election_type.enum';
import { StvElectionService } from '@/common/services/elections/stv/stv_election.service';
import { DangerException } from '@/common/exceptions/danger.exception';

export const ElectionServiceProvider: Provider = {
  provide: ElectionService,
  useClass: (() => {
    switch (process.env.ELECTION_TYPE) {
      case ElectionTypeEnum.STV:
        return StvElectionService;
      default:
        throw new DangerException('Unsupported ELECTION_TYPE');
    }
  })(),
};
