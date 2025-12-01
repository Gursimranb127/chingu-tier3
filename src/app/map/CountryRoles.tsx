import { useSelectedCountry } from '@/stores/useSelectedCountry';
import { useCountryRoles } from '@/hooks/useCountryRoles';
import { ChinguRoleCount } from '@/features/chingu/chingu.type';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import ReactCountryFlag from 'react-country-flag';

export const CountryRoles = () => {
  const { selectedCountry, setSelectedCountry } = useSelectedCountry();

  const {
    isLoading: areCountryRolesLoading,
    error: countryRolesError,
    data: countryRoles,
  } = useCountryRoles({
    countryCode: selectedCountry?.countryCode ?? undefined,
    countryName: selectedCountry?.countryName ?? undefined,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCountry(null);
    }
  };

  if (!selectedCountry) return null;

  return (
    <Dialog open={!!selectedCountry} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] fixed bottom-12 top-auto translate-y-0 pt-4">
        <DialogHeader className="gap-4 flex flex-row items-center">
          <div className="border rounded-full p-2 bg-secondary">
            {selectedCountry.countryCode ? (
              <ReactCountryFlag
                countryCode={selectedCountry.countryCode}
                style={{
                  fontSize: '1.8rem',
                  lineHeight: '1.8rem',
                }}
              />
            ) : null}
          </div>
          <DialogTitle className="text-left font-bold text-xl">
            {selectedCountry.countryName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-4 flex-col ">
          {areCountryRolesLoading && (
            <>
              <Skeleton className="h-8 w-full]" />
              <Skeleton className="h-8 w-full]" />
              <Skeleton className="h-8 w-full]" />
              <Skeleton className="h-8 w-full]" />
              <Skeleton className="h-8 w-full]" />
              <Skeleton className="h-8 w-full]" />
            </>
          )}
          {countryRolesError && <div>Country roles error</div>}
          {countryRoles?.roles.map((role: ChinguRoleCount) => (
            <div key={role.voyageRole} className="flex flex-col">
              <div className="flex flex-row justify-between">
                <p>
                  <span>{role.count}</span> {role.voyageRole ?? 'Unknown Role'}
                  {role.count > 1 && 's'}
                </p>
                <p>{((role.count / selectedCountry.count) * 100).toFixed()}%</p>
              </div>
              <Progress
                value={(role.count / selectedCountry.count) * 100}
                className="progress-track bg-input"
              />
            </div>
          ))}
        </div>
        <DialogFooter className="pt-8">
          <Button className="flex grow bg-[#444]">View Chingus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
