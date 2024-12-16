import { useEffect, useState } from "react"
import { useDevvitListener } from "../hooks/useDevvitListener"
import { sendToDevvit } from "../utils"
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../components/LeaderBoardEntry';
import { Loader } from "../components/Loader";
import { useSetPage } from "../hooks/usePage";

// Leaderboard Component
const Leaderboard = ({isGameOver}: {isGameOver: boolean}) => {
    const leaderboardData = useDevvitListener('LEADERBOARD_SCORE');
    const players = leaderboardData?.leaderboard || [];
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const pageCount = Math.ceil(players.length / itemsPerPage);
    const paginatedPlayers = players.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const setPage = useSetPage();

    useEffect(() => {
        sendToDevvit({ type: 'GET_LEADERBOARD' })
    }, [])

    if (players.length === 0) {
        return (
            <div className="w-full min-h-screen max-w-md mx-auto p-4 flex justify-center py-12">
                <Loader size="lg" color="secondary" label="Loading leaderboard..." />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mx-auto p-4 bg-gray-200 h-full relative"
        >
               <button 
                onClick={()=>{isGameOver? setPage('userChoice'): setPage('home')}}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-300 transition-colors"
            >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="max-w-md flex flex-col h-full m-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
                <Crown className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
            </div>
            <div className="space-y-2 grow">
                {paginatedPlayers.map((player, index) => (
                    <LeaderboardEntry
                        key={index}
                        player={{
                            username: player.member,
                            score: player.score
                        }}
                        index={currentPage * itemsPerPage + index}
                    />
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
                {currentPage !== 0 && (
                    <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
                >
                    <ChevronLeft />
                </button>
                )}
                <span className="px-3 py-1 text-gray-800">
                    Page {currentPage + 1} of {pageCount}
                </span>
                {currentPage !== pageCount - 1 && (
                <button
                    onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
                    disabled={currentPage === pageCount - 1}
                    className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
                >
                    <ChevronRight />
                </button>
                )}
            </div>
            </div>
        </motion.div>
    )
}

export default Leaderboard;