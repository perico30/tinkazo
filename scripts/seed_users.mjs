import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvrdcdodtgfvyppvklpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cmRjZG9kdGdmdnlwcHZrbHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NzA3MjMsImV4cCI6MjA4OTU0NjcyM30.E61NhCh_StmfdRP6vTya7T8yuQWuVWiVHlg0k7EsU4Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUsers() {
  console.log('Iniciando creacion de usuarios default...');

  const users = [
    { email: 'admin@tinkazo.com', password: 'Password123!', role: 'admin', username: 'SuperAdmin' },
    { email: 'vendedor@tinkazo.com', password: 'Password123!', role: 'seller', username: 'Vendedor1' },
    { email: 'cliente@tinkazo.com', password: 'Password123!', role: 'client', username: 'Cliente1' }
  ];

  for (const u of users) {
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: {
        data: { role: u.role, username: u.username }
      }
    });

    if (error) {
      console.error(`Error creando ${u.email}:`, error.message);
    } else {
      console.log(`Usuario ${u.email} creado con exito! ID:`, data.user?.id);
      
      // Since our trigger handles 'pending', we need to update 'admin' to 'active' manually 
      // via an update if we want them to be active right away. But wait, RLS prevents updates to status!
      // The user can activate them from the Supabase Dashboard -> Table Editor -> users.
      console.log(`NOTA: Ve al Panel de Supabase -> Table Editor -> users, y cambia el 'status' a 'active' para poder entrar.`);
    }
  }
}

seedUsers();
