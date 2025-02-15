import * as aiService from '../services/ai.service.js';

export const aiResponse = async (req,res) => {
    const prompt=req.query.prompt
    if(!prompt){
        return 'Please provide a prompt'
    }
    try{
        const response=await aiService.aiResponse(prompt)
        return res.status(200).json(response)
    }catch(err){
        return res.status(500).json(err.message)
    }
}
