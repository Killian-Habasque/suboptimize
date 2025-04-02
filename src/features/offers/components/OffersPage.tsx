import React, { useState } from 'react';
import AddOfferDialog from './AddOfferDialog';

const OffersPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>
            <h1>Offres</h1>
            <button onClick={() => setIsDialogOpen(true)}>Ajouter une offre</button>
            <AddOfferDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
            {/* Affichez ici la liste des offres */}
        </div>
    );
};

export default OffersPage; 