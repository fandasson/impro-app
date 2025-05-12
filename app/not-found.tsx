import { Paragraph } from "@/components/ui/Paragraph";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { SharingActions } from "@/components/users/SharingActions";

export default async function NotFound() {
    return (
        <MobileContainer>
            <div className="flex flex-grow flex-col">
                <div className="flex flex-grow flex-col justify-center text-center">
                    <Paragraph>No to je trapas!</Paragraph>
                    <Paragraph>Žádný nápad, co vám zobrazit. Nic.</Paragraph>
                    <Paragraph>To se nikdy nemělo stát.</Paragraph>
                    <Paragraph>Ale co už.</Paragraph>
                    <Paragraph>Ale zůstane to mezi námi že jo?</Paragraph>
                    <Paragraph className={"mt-2"}>mrk mrk</Paragraph>
                </div>
            </div>
            <SharingActions />
        </MobileContainer>
    );
}
