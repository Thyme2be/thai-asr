export interface DynamicCardProps {
    cardType: string,
    transcribeText: (text: string) => void,
}