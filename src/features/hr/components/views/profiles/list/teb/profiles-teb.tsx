import { ErpTeb } from '@/common/components/ui/teb';
import { ShowModalButton } from '@/common/components/ui/button';

interface Props {
  modalKey: string;
  allowedProfileTeams: string[];
}

export default function ProfilesTeb({ modalKey, allowedProfileTeams }: Props) {
  return (
    <ErpTeb domain="hr">
      <ShowModalButton
        allowedProfileTeams={allowedProfileTeams}
        modalKey={modalKey}
        name="추가"
        className="me-2"
      />
    </ErpTeb>
  );
}
