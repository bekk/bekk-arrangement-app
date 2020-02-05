import { Result } from './validation';

export const validateTimeInstance = (time: string): Result<string, Date> => {
    const timestamp = Date.parse(time);

    if (isNaN(timestamp)) {
        return { editValue: time, errors: [{ type: "Error", message: "Feil format på streng. Prøv noe som: 2020-02-05 10:07" }] };
    }

    return { editValue: time, validValue: new Date(timestamp), errors: undefined }
}