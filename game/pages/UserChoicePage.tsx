// to show user if they need to chose
// 1. to attempt game again
// 2. check leaderboard
// 3. generate new Pop game

import { motion } from "framer-motion"
import { PlayCircle, Trophy, Sparkles } from "lucide-react"
import { useSetPage } from "../hooks/usePage"
import { sendToDevvit } from "../utils";
import { useDevvitListener } from "../hooks/useDevvitListener";
import { useEffect, useState } from "react";

const UserChoicePage = ({ attemptNumber }: { attemptNumber: number }) => {
    const setPage = useSetPage();
    const playAgainConfigured = useDevvitListener('PLAY_AGAIN_CONFIGURED');
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(playAgainConfigured){
           sendToDevvit({type: 'INIT'})
        }
    }, [playAgainConfigured])
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-[#e0e0e0] to-[#c0c0c0] flex items-center justify-center p-4"
        >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#FF69B4] to-[#bf006b] p-6 text-center">
                    <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
                    <h3 className="text-lg font-bold text-white">You have already played this round. What would you like to do?</h3>
                </div>
                <div className="p-6 space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-[#4169E1] text-white py-4 rounded-xl flex items-center justify-center space-x-3 
                        shadow-md hover:shadow-lg transition-all duration-300 group"
                        onClick={() => { 
                            setLoading(true); 
                            sendToDevvit({ type: 'PLAY_AGAIN', payload: { attemptNumber } })
                        }}
                        disabled={loading}
                    >
                        <PlayCircle
                            size={24}
                            className="group-hover:animate-pulse"
                        />
                        <span className="font-semibold">Play Again</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-[#32CD32] text-white py-4 rounded-xl flex items-center justify-center space-x-3 
                        shadow-md hover:shadow-lg transition-all duration-300 group"
                        onClick={() => {setLoading(true); setPage('leaderboard')}}
                        disabled={loading}
                    >
                        <Trophy
                            size={24}
                            className="group-hover:animate-pulse"
                        />
                        <span className="font-semibold">Leaderboard</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-[#FFA500] text-white py-4 rounded-xl flex items-center justify-center space-x-3 
                        shadow-md hover:shadow-lg transition-all duration-300 group"
                        onClick={() => {
                            setLoading(true);
                            sendToDevvit({ type: 'CREATE_NEW_GAME' })
                        }}
                        disabled={loading}
                    >
                        <Sparkles
                            size={24}
                            className="group-hover:animate-pulse"
                        />
                        <span className="font-semibold">New Game</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default UserChoicePage