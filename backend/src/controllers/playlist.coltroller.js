import { db } from "../libs/db.js";

export const createPlaylist = async(req, res)=>{
    try {
        const {name, description} = req.body;
        const userId = req.user.id;
    
        const playlist = await db.playlist.create({
            data:{
                name,
                description,
                userId
            }
        });
    
        res.status(200).json({
            success:true,
            message:"Playlist created successfully",
            playlist
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error:"Falied to create playlist",
        })
    }
}

export const getAllListDetails = async(req, res)=>{
    try {
        const  playlists= await db.playlist.findMany({
            where:{
                userId:req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })
        res.status(200).json({
            success:true,
            message:"Playlists fetched successfully",
            playlists
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error:"Falied to fetch playlist",
        })
    }
}

export const getPlaylistDetails = async(req, res)=>{
    const {playlistId} = req.params;
    try {
        const playlist = await db.playlist.findUnique({
            where:{
                id:playlistId,
                userId:req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        });

        if(!playlist){
            return res.status(404).json({
                error:"Playlist not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Playlist fetched successfully",
            playlist
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error:"Falied to fetch playlist",
        })
    }

}

export const addProblemToPlaylist = async(req, res)=>{
    const {playlistId} = req.params;
    const {problemIds} = req.body;

    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({
                error:"Invaid of missing problemsId" 
            })
        }

        try {
            const problemsInPlaylist = await db.problemInPlaylist.createMany({
                data:problemIds.map((problemId)=>({
                    playlistId,
                    problemId
                }))
            })
            res.status(201).json({
                success:true,
                message:"Problems added in playlist successfully",
                problemsInPlaylist
            })
        } catch (error) {
            res.status(400).json({
                message:"Problem already exists in playlist",
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error:"Falied to add problem in playlist",
        })
    }
}

export const deletePlaylist = async(req, res)=>{
    const {playlistId} = req.params;

    try {
        const deletedPlaylist = await db.playlist.delete({
            where:{
                id:playlistId
            }
        });
        res.status(200).json({
            success:true,
            message:"Playlist deleted successfully",
            deletedPlaylist
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error:"Falied to delete playlist",
        })
    }
}

export const removeProblemFromPlaylist = async(req, res)=>{
    const {playlistId} = req.params;
    const {problemIds} = req.body;

    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({
                error:"Invaild or missing problemsId"
            })
        }
        const deletedProblem = await db.problemsInPlaylist.deleteMany({
            where:{
                playlistId,
                problemId:{
                    in:problemIds
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Problem removed from playlist successfully",
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error:"Falied to remove problem from playlist",
        })
    }
}