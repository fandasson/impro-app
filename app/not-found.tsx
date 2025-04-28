import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { SharingActions } from "@/components/users/SharingActions";

export default async function NotFound() {
    return (
        <MobileContainer>
            <div className={"flex flex-grow items-center justify-center gap-8"}>Přijďe na představení 😳</div>
            <SharingActions />
        </MobileContainer>
    );
}
