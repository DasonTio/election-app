export default async function parseJson(request: Request){
    try {
        return await request.json();
    } catch {
        return null;
    }
};

