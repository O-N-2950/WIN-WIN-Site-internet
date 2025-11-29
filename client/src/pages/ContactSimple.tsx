import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function ContactSimple() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = trpc.contact.sendMessage.useMutation();
  const uploadFile = trpc.contact.uploadAttachment.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.email || !formData.message) {
      alert('Remplissez tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      let attachmentUrl = undefined;

      // Upload fichier si présent
      if (file) {
        console.log('📎 [ContactSimple] Fichier détecté:', file.name, file.size, 'bytes');
        console.log('📎 [ContactSimple] Début conversion base64...');
        
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        console.log('📎 [ContactSimple] Base64 converti, longueur:', base64.length);
        console.log('📎 [ContactSimple] Début upload Cloudinary...');

        const result = await uploadFile.mutateAsync({
          base64Data: base64,
          filename: file.name
        });
        
        attachmentUrl = result.url;
        console.log('✅ [ContactSimple] Upload Cloudinary réussi!');
        console.log('✅ [ContactSimple] URL Cloudinary:', attachmentUrl);
      } else {
        console.log('ℹ️ [ContactSimple] Aucun fichier attaché');
      }

      // Envoyer message
      console.log('📧 [ContactSimple] Envoi du message avec attachmentUrl:', attachmentUrl);
      await sendMessage.mutateAsync({
        ...formData,
        attachmentUrl,
        attachmentFilename: file?.name
      });
      console.log('✅ [ContactSimple] Message envoyé avec succès!');

      alert('✅ Message envoyé avec succès !');
      
      // Reset
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' });
      setFile(null);
      
    } catch (error) {
      console.error(error);
      alert('❌ Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Contact</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Nom *</label>
          <input
            type="text"
            required
            value={formData.nom}
            onChange={e => setFormData({...formData, nom: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Téléphone</label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={e => setFormData({...formData, telephone: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Sujet</label>
          <input
            type="text"
            value={formData.sujet}
            onChange={e => setFormData({...formData, sujet: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Message *</label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Fichier (optionnel)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          {file && <p className="text-sm mt-2">📎 {file.name}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}
