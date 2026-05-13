import type { Performance } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { Paragraph } from "@/components/ui/Paragraph";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { OnboardingPracticeQuestion } from "@/components/users/onboarding/OnboardingPracticeQuestion";
import { completeOnboarding, setOnboardingStep, useUsersStore } from "@/store/users.store";

type Props = {
    performance: Performance;
    hasMottoQuestion: boolean;
};

const STEPS = {
    INTRO: 0,
    REFRESH: 1,
    RETURN: 2,
    VOTING: 3,
};

export const OnboardingWizard = ({ performance, hasMottoQuestion }: Props) => {
    const { currentStep } = useUsersStore((state) => state.onboarding);

    const handleNextStep = (step: number) => {
        setOnboardingStep(step);
    };

    const handleComplete = () => {
        completeOnboarding();
    };

    return (
        <MobileContainer>
            {currentStep === STEPS.INTRO && (
                <div className="flex flex-grow flex-col items-center gap-8">
                    <h1 className="text-center text-xl">{performance.name}</h1>
                    <div className="flex flex-col gap-4">
                        <Paragraph>
                            Naše aplikace je obyčejná webová stránka. Dokud ji nezavřete, najdete ji ve svém prohlížeči.
                        </Paragraph>
                        <Paragraph>
                            Vše důležité bude na této jedné stránce (adrese). Nemusíte ji otevírat znovu.
                        </Paragraph>
                        <Paragraph>
                            Moderátor vás upozorní pokaždé, když budete moci ovlivnit představení skrze aplikaci.
                        </Paragraph>
                        <Paragraph>
                            Tady je pár tipů, jak s aplikací pracovat. Vyzkoušejte to, ať při představení netápete.
                        </Paragraph>
                    </div>
                    <Button onClick={() => handleNextStep(STEPS.REFRESH)} className="w-full">
                        Jasný, ukaž mi jak to funguje
                    </Button>
                    <Button onClick={handleComplete} className="w-full" variant={"secondary"}>
                        Už to znám
                    </Button>
                </div>
            )}

            {currentStep === STEPS.REFRESH && (
                <div className="flex-g row flex flex-col items-center gap-8">
                    <div className="flex flex-col justify-center gap-4">
                        <Paragraph>
                            Co když se aplikace se chová divně? Ukazuje něco jiného než by měla? Nebo neukazuje nic?
                        </Paragraph>
                        <Paragraph className={"text-2xl font-bold"}>Aktualizujte stránku</Paragraph>
                        <Paragraph>
                            Většinou stačí &ldquo;stáhnout&rdquo; prstem obsah stránky dolů dokud se nezačně někde točit
                            nějaké kolečko.
                        </Paragraph>
                        <Paragraph className={"italic"}>
                            Občas se to někomu stane. Možná erupce na slunci, možná osud... 🤷‍♂️
                        </Paragraph>
                    </div>
                    <Button onClick={() => handleNextStep(STEPS.RETURN)} className="w-full">
                        OK, chápu
                    </Button>
                </div>
            )}

            {currentStep === STEPS.RETURN && (
                <div className="flex-g row flex flex-col items-center gap-8">
                    <div className="flex flex-col justify-center gap-4">
                        <Paragraph>
                            Během představení budete telefon uklízet a zase vyndavat. To vám určitě zamkne obrazovku.
                        </Paragraph>
                        <Paragraph>Raději si teď vyzkoušejte, že aplikaci snadno najdete.</Paragraph>
                        <Paragraph>Schovejte si telefon abyste si uvolnili ruce na drink nebo potlesk.</Paragraph>
                        <Paragraph>
                            A pak se zkuste vrátit do aplikace. Možná uvidíte aplikaci hned po odemčení, možná budete
                            muset otevřít prohlížeč.
                        </Paragraph>
                    </div>
                    <Button onClick={() => handleNextStep(STEPS.VOTING)} className="w-full">
                        Vyzkoušeno, pojďme dál
                    </Button>
                </div>
            )}

            {currentStep === STEPS.VOTING && (
                <OnboardingPracticeQuestion onComplete={handleComplete} hasMottoQuestion={hasMottoQuestion} />
            )}
        </MobileContainer>
    );
};
