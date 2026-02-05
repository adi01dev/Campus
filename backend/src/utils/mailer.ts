export const sendEmail = async (to: string, subject: string, text: string) => {
    console.log(`Sending email to ${to} with subject: ${subject}`);
    return Promise.resolve();
};
