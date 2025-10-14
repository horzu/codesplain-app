"use server"

export async function explain(prevState, formData) {
    const code = formData.get('code');
    const language = formData.get('language');
    console.log('Explaining code in language:', language);

    if (!code || !language) {
        throw new Error('Code and language are required');
    }
    
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/explain-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ language, code })
        });
        if (!res.ok) {
            return {
                success: false, 
                message: 'Failed to fetch explanation from server'
            };
        }

        const data = await res.json();
        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while fetching explanation: ' + error.message
        };
    }
}