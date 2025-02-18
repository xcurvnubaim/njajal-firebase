const API_URL = 'http://localhost:8000';

export async function getChat() {
    const idToken = localStorage.getItem('idToken');
    return fetch(`${API_URL}/chats`, {
        headers: {
            'Authorization': idToken,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.error(error));
}

export async function createChat(text) {
    const idToken = localStorage.getItem('idToken');
    return fetch(`${API_URL}/chats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': idToken,
        },
        body: JSON.stringify({ text }),
    })
        .then((res) => res.json())
        .catch((error) => console.error(error));
}