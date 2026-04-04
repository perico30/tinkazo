import React, { useState, useMemo } from 'react';
import type { AppConfig, Team } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import PencilIcon from '../../components/icons/PencilIcon';

interface TeamsTabProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const TeamModal: React.FC<{
    team: Partial<Team> | null;
    onClose: () => void;
    onSave: (team: Team) => void;
}> = ({ team, onClose, onSave }) => {
    const [name, setName] = useState(team?.name || '');
    const [logo, setLogo] = useState(team?.logo || '');

    if (!team) return null;

    const handleSave = () => {
        if (name && logo) {
            onSave({
                id: team.id || new Date().toISOString(),
                name,
                logo,
            });
            onClose();
        } else {
            alert('Por favor, completa el nombre y sube un logo.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{team.id ? 'Editar Equipo' : 'Añadir Equipo'}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1">Nombre del Equipo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-700 p-2 rounded"
                                placeholder="Ej. Real Madrid"
                            />
                        </div>
                        <ImageUpload
                            label="Logo del Equipo"
                            imageUrl={logo}
                            onImageSelect={setLogo}
                        />
                    </div>
                </div>
                <div className="bg-gray-700/50 p-4 flex justify-end gap-4 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-900 font-bold hover:bg-cyan-400">Guardar</button>
                </div>
            </div>
        </div>
    );
};


const TeamsTab: React.FC<TeamsTabProps> = ({ config, setConfig }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalTeam, setModalTeam] = useState<Partial<Team> | null>(null);

    const handleAddTeam = () => {
        setModalTeam({});
    };

    const handleEditTeam = (team: Team) => {
        setModalTeam(team);
    };

    const handleDeleteTeam = (teamId: string) => {
        const isTeamInUse = config.jornadas.some(jornada =>
            jornada.matches.some(match =>
                match.localTeamId === teamId || match.visitorTeamId === teamId
            )
        );

        if (isTeamInUse) {
            alert('Este equipo no se puede eliminar porque está asignado a al menos un partido en una jornada. Por favor, elimine los partidos asociados primero.');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
            setConfig(prev => ({
                ...prev,
                teams: prev.teams.filter(t => t.id !== teamId)
            }));
        }
    };

    const handleSaveTeam = (team: Team) => {
        setConfig(prev => {
            const teamExists = prev.teams.some(t => t.id === team.id);
            if (teamExists) {
                return { ...prev, teams: prev.teams.map(t => t.id === team.id ? team : t) };
            }
            return { ...prev, teams: [...prev.teams, team] };
        });
    };

    const filteredAndSortedTeams = useMemo(() => {
        return config.teams
            .filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [config.teams, searchQuery]);

    return (
        <div className="max-w-4xl mx-auto">
            {modalTeam && <TeamModal team={modalTeam} onClose={() => setModalTeam(null)} onSave={handleSaveTeam} />}

            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Gestión de Equipos</h2>
                    <button onClick={handleAddTeam} className="flex items-center gap-2 bg-cyan-500 text-gray-900 font-bold px-3 py-2 rounded-lg hover:bg-cyan-400">
                        <PlusIcon className="h-5 w-5" />
                        Añadir Equipo
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar equipo..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded"
                    />
                </div>

                <div className="space-y-2">
                    {filteredAndSortedTeams.length > 0 ? (
                        filteredAndSortedTeams.map(team => (
                            <div key={team.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain rounded-full bg-white p-1" />
                                    <span className="font-medium">{team.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditTeam(team)} className="p-2 text-gray-300 hover:text-white"><PencilIcon className="h-5 w-5"/></button>
                                    <button onClick={() => handleDeleteTeam(team.id)} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">No se encontraron equipos. ¡Añade uno!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamsTab;