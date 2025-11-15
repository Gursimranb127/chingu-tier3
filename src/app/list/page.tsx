import { chinguService } from '../../features/chingu/chingu.service';
import { ChinguType } from '../../features/chingu/chingu.type';

export default async function ListPage() {
  const chingus = await chinguService.getAllChingus({
    where: {
      countryCode: 'GB',
      gender: 'MALE'
    },
    limit: 10,
  });

  return (
    <div>
      <h1>List Page</h1>
      {chingus.map((chingu: ChinguType) => (
        <div key={chingu.id} className='flex gap-5'>
          <p>{chingu.countryName} {chingu.countryCode}</p>
          <p>{chingu.gender}</p>
          <p>{chingu.goal}</p>
          <p>{chingu.source}</p>
        </div>
      ))}
    </div>
  );
}
