const testData = 'Test WIN WIN Finance - Upload fichier';
const buffer = Buffer.from(testData);
const base64 = buffer.toString('base64');

const formData = new FormData();
const blob = new Blob([buffer], { type: 'text/plain' });
formData.append('file', blob, 'test-winwin.txt');

console.log('[Test tmpfiles] Upload en cours...');

try {
  const response = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData,
  });

  console.log('[Test tmpfiles] Status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Test tmpfiles] ❌ Erreur:', errorText);
  } else {
    const result = await response.json();
    console.log('[Test tmpfiles] ✅ Réponse:', JSON.stringify(result, null, 2));
    
    if (result.data?.url) {
      const directUrl = result.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      console.log('[Test tmpfiles] URL directe:', directUrl);
    }
  }
} catch (error) {
  console.error('[Test tmpfiles] ❌ Exception:', error.message);
}
