CreateOre = function(id,name,texture,level,data){
    IDRegistry.genBlockID(id);
    Block.createBlock(id,[{name:name,texture:texture,inCreative:true}],"opaque");
    ToolAPI.registerBlockMaterial(BlockID[id],"stone",level);
    Block.setDestroyTime(BlockID[id],3);
    
    var ore = FileTools.ReadJSON(__dir__ + "res/config/ore.json");

    if(data){
        var config = {enabled:ore[data].enabled,count:ore[data].count,size:ore[data].size,minHeight:ore[data].minHeight,maxHeight:ore[data].maxHeight}
        
        if(config.enabled){
            Callback.addCallback("GenerateChunkUnderground",function(chunkX,chunkZ){
                for(var i = 0;i < config.count;i++){
                    var coords = GenerationUtils.randomCoords(chunkX,chunkZ,config.minHeight,config.maxHeight);
                    GenerationUtils.generateOre(coords.x,coords.y,coords.z,BlockID[id],0,config.size);
                }
            });
        }
    }
}

CreateOre("oreCopper"      ,"Copper Ore"      ,[["oreCopper"      ,0]],2,"copper"      );
CreateOre("oreTetrahedrite","Tetrahedrite Ore",[["oreTetrahedrite",0]],2,"tetrahedrite");
CreateOre("oreTin"         ,"Tin Ore"         ,[["oreTin"         ,0]],2,"tin"         );
CreateOre("oreLead"        ,"Lead Ore"        ,[["oreLead"        ,0]],2,"lead"        );
CreateOre("oreLithium"     ,"Lithium Ore"     ,[["oreLithium"     ,0]],2,"lithium"     );
CreateOre("oreGraphite"    ,"Graphite Ore"    ,[["oreGraphite"    ,0]],2,"graphite"    );
CreateOre("oreTungsten"    ,"Tungsten Ore"    ,[["oreTungsten"    ,0]],2,"tungsten"    );
CreateOre("oreAntimony"    ,"Antimony Ore"    ,[["oreAntimony"    ,0]],2,"antimony"    );
CreateOre("oreUranium"     ,"Uranium Ore"     ,[["oreUranium"     ,0]],2,"uranium"     );
CreateOre("oreSilver"      ,"Silver Ore"      ,[["oreSilver"      ,0]],2,"silver"      );
CreateOre("oreAluminium"   ,"Aluminium Ore"   ,[["oreAluminium"   ,0]],2,"aluminium"   );

ETTool.setHammerDestroyDrop(BlockID.oreCopper      ,ItemID.oreChunkCopper      ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreTetrahedrite,ItemID.oreChunkTetrahedrite,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreTin         ,ItemID.oreChunkTin         ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreLead        ,ItemID.oreChunkLead        ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreLithium     ,ItemID.oreChunkLithium     ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreTungsten    ,ItemID.oreChunkTungsten    ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreAntimony    ,ItemID.oreChunkAntimony    ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreUranium     ,ItemID.oreChunkUranium     ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreSilver      ,ItemID.oreChunkSilver      ,4,0,true);
ETTool.setHammerDestroyDrop(BlockID.oreAluminium   ,ItemID.oreChunkAluminium   ,4,0,true);

Callback.addCallback("PreLoaded",function(){
    Recipes.addFurnace(BlockID.oreCopper      ,ItemID.ingotCopper      );
    Recipes.addFurnace(BlockID.oreTetrahedrite,ItemID.ingotTetrahedrite);
    Recipes.addFurnace(BlockID.oreTin         ,ItemID.ingotTin         );
    Recipes.addFurnace(BlockID.oreLead        ,ItemID.ingotLead        );
    Recipes.addFurnace(BlockID.oreLithium     ,ItemID.ingotLithium     );
    Recipes.addFurnace(BlockID.oreGraphite    ,ItemID.dustCarbon       );
    Recipes.addFurnace(BlockID.oreAntimony    ,ItemID.ingotAntimony    );
    Recipes.addFurnace(BlockID.oreUranium     ,ItemID.ingotUranium     );
    Recipes.addFurnace(BlockID.oreSilver      ,ItemID.ingotSilver      );
    Recipes.addFurnace(BlockID.oreAluminium   ,ItemID.ingotAluminium   );

    ETRecipe.addBlastFurnaceRecipe({id:BlockID.oreTungsten,data:0},{id:ItemID.ingotTungsten,count:1,data:0});
});

Block.registerDropFunction("oreGraphite",function(coords,id,data,level,enchant){
	if(level >= 2){
        if(enchant.silk){
            return [[id,1,data]];
        }
        return [[ItemID.dustCarbon,random(1 * (enchant.fortune + 1),4 * (enchant.fortune + 1)),0]];
    }
},2);