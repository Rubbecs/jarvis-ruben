import { useEffect, useState } from 'react';
import { createMemoryNode, fetchMemory } from '../api';

export function MemoryVault() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [links, setLinks] = useState('');

  const load = async () => {
    setNodes(await fetchMemory());
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const handleCreate = async () => {
    await createMemoryNode({
      title,
      body,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      links: links.split(',').map((link) => link.trim()).filter(Boolean)
    });
    setTitle('');
    setBody('');
    setTags('');
    setLinks('');
    load().catch(console.error);
  };

  return (
    <section>
      <div className="panel-header">
        <h2>Memory Vault</h2>
        <p>View local markdown-style memory nodes, tags, and backlink relationships.</p>
      </div>
      <div className="panel-grid">
        <div className="panel-card">
          <h3>Create memory note</h3>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
          <label>Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Note body" />
          <label>Tags</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Comma-separated tags" />
          <label>Links</label>
          <input value={links} onChange={(e) => setLinks(e.target.value)} placeholder="Comma-separated backlinks" />
          <button onClick={handleCreate}>Save note</button>
        </div>

        <div className="panel-card full-width">
          <h3>Vault explorer</h3>
          <div className="list">
            {nodes.length ? (
              nodes.map((node) => (
                <div key={node.id} className="list-item">
                  <div>
                    <strong>{node.title}</strong>
                    <p>{node.body.slice(0, 120)}...</p>
                    <small>{(node.tags || []).join(', ') || 'No tags'}</small>
                  </div>
                </div>
              ))
            ) : (
              <p>No memory entries found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
