import {db} from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async(req,res) =>{
    // get all data
    const {title, description, difficulty, tags, examples, constraints, testcases,referenceSolution, codeSnippets} = req.body;

    //check if the user is ADMIN
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({
            success:false,
            error:"Sorry, only admin is allwed to create the problem"
        })
    }

    try {
        for(const [language, solutionCode] of Object.entries(referenceSolution)){
            const languageId = getJudge0LanguageId(language);

            if(!languageId){
                return res.status(400).json({
                    success: false,
                    error:`Language ${language} is not supported`
                })
            }
    
            const submission = testcases.map(({input, output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output
            }))
           
            const submissionResults = await submitBatch(submission);

            const tokens = submissionResults.map((res)=>res.token);

            const results = await pollBatchResults(tokens);
        
            for(let i=0; i<results.length; i++)
            {
                const result = results[i]

                console.log("Results : ", result);

                //console.log(`Testcase ${i+1} and language ${language} --- result ${JSON.stringify(results.status.description)}`);

                if(result.status.id !== 3){
                    return res.status(400).json({
                        error: `Testcase ${i+1} failed for language ${language}`
                    })
                }
            }
        }
           
            // save problem to db
            const newProblem = await db.problem.create({
                data:{
                    title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolution, userId:req.user.id
                }
            })

            res.status(201).json({
                success: true,
                message: 'Problem created successfully',
                problem: newProblem,
            });
    } catch (error) {
        console.error('Error creating problem:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create problem' 
        });
    }
}

export const getAllProblems = async(req, res)=>{
    try {
        const problems = await db.problem.findMany(
            {
                include:{
                    solvedBy:{
                        where:{
                            userId:req.user.id
                        }
                    }
                }
            }
        );

        if(!problems){
            res.status(404).json({
                success:false,
                message:"No problem found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Problem featched successfully",
            problems:problems,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Error while featching problem"
        })
    }
    
}

export const getProblemById = async(req, res)=>{
    try {

        const {id} = req.params;
        
        const problems = await db.problem.findUnique({
            where:{
                id
            }
        })

        if(!problems){
            res.status(404).json({
                success:false,
                message:"Problem not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Problem featched successfully",
            problem:problems
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Error while featching problem by ID",
        })
    }
}

export const updateProblem = async(req, res)=>{
    try {
        const {id} = req.params;

        const {title, description, difficulty, tags, examples, constraints, testcases,referenceSolution, codeSnippets} = req.body;
        
        const problem = await db.problem.findUnique({ where : {id}});

        if(!problem){
            return res.status(400).json({
                error:"Problem not found"
            })
        }

        if(req.user.role !== 'ADMIN'){
            return res.status(403).json({
                success:false,
                error:"Sorry, only admin is allowed to create the problem"
            })
        }
        console.log("body:", JSON.stringify(req.body, null, 2));

        console.log(referenceSolution)
        for(const [language, solutionCode] of Object.entries(referenceSolution)){
            const languageId = getJudge0LanguageId(language);
            
            if(!languageId){
                return res.status(400).json({
                    success: false,
                    error:`Language ${language} is not supported`
                })
            }
               
            const submission = testcases.map(({input, output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output
            }))
            
            const submissionResults = await submitBatch(submission);
            
            const tokens = submissionResults.map((res)=>res.token);
            
            const results = await pollBatchResults(tokens);
            
            for(let i=0; i<results.length; i++)
            {
                const result = results[i]

                console.log("Results : ", result);

                //console.log(`Testcase ${i+1} and language ${language} --- result ${JSON.stringify(results.status.description)}`);

                if(result.status.id !== 3){
                    return res.status(400).json({
                        error: `Testcase ${i+1} failed for language ${language}`
                    });
                }
            }
            
        }

        const updatedProblem = await db.problem.update({
            where:{
                id
            },
            data:{
                title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolution
            }
        })
        
        res.status(201).json({
            success: true,
            message: 'Problem updated successfully',
            problem: updatedProblem,
        });
        
    } catch (error) {
        console.error('Error updating problem:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed in updating problem' 
        });
    }
}

export const deleteProblem = async(req, res)=>{
    const {id} = req.params;

    try {
        const problem = await db.problem.findUnique({
            where:{
                id
            }
        });

        if(!problem){
            return res.status(404).json({
                error:"Problem not found"
            });
        }

        await db.problem.delete({
            where:{
                id
            }
        });

        res.status(200).json({
            success:true,
            message:"Problem deleted successfully",
        })
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete problem' 
        });
    }
}

export const getAllProblemsSolvedByUser = async(req, res)=>{
    try {
        const problems = await db.problem.findMany({
            where:{
                solvedBy:{
                    some:{
                        userId:req.user.id
                    }
                }
            },
            include:{
                solvedBy:{
                    where:{
                        userId:req.user.id
                    }
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Problem featched successfully",
            problems
        })
    } catch (error) {
        console.error("Error fetching problems: ", error);
        res.status(500).json({
            success:false,
            error:"Failed to fetch problems",
        })
    }
}