ETMachine.wireIDs = {}

ETMachine.isWire = function(id){
    return ETMachine.wireIDs[id];
}

function CreateWire(id,name,texture,volt,size){
    // Block
	IDRegistry.genBlockID(id);
	Block.createBlock(id,[
        {name:name,texture:[[texture.name,0]],inCreative:false},
        {name:name,texture:[[texture.name,1]],inCreative:false}
	],"wire");

    EU.registerWire(BlockID[id],volt);
    ETMachine.wireIDs[BlockID[id]] = true;
    wheat.item.addTooltip(ItemID[id],Translation.translate("Max Voltage: ") + volt + "EU/t");
    
    TileRenderer.setupWireModel(BlockID[id],0,0.0625 *  size     ,"et-wire");
    TileRenderer.setupWireModel(BlockID[id],1,0.0625 * (size + 1),"et-wire");
    
	Block.registerDropFunction(id,function(coords,ID,Data){
        var block = {id:ID,data:Data}
		if(block.data == 1){
            return [[ItemID[id],1,0],[171,1,15]];
        }
        return [[ItemID[id],1,0]];
    }); 
    
    // Item
	IDRegistry.genItemID(id);
	Item.createItem(id,name,texture);
    
    Item.registerUseFunction(id,function(coords,item,block){
        var place = coords;
        if(!isCanTileReplaced(block.id,block.data)){
            place = coords.relative,block = World.getBlock(place.x,place.y,place.z);
            if(!isCanTileReplaced(block.id,block.data)){
                return;
            }
        }
        World.setBlock(place.x,place.y,place.z,BlockID[id],0);
        EnergyTypeRegistry.onWirePlaced(place.x,place.y,place.z);
        Player.decreaseCarriedItem(1);
    });

    Item.registerUseFunctionForID(171,function(coords,item,block){
        if(item.data == 15 && ETMachine.wireIDs[block.id] && block.data == 0){
            Game.prevent();
            World.setBlock(coords.x,coords.y,coords.z,block.id,1);
            Player.setCarriedItem(item.id,item.count - 1,item.data);
        }
    });
}

Callback.addCallback("DestroyBlockStart",function(coords,block){
    var item = Player.getCarriedItem();
    if(ETMachine.isWire(block.id) && ETTool.isTool(item.id,"Cutter")){
        Block.setTempDestroyTime(block.id,0);
        SoundAPI.playSound("tool/wrench.ogg");
        ToolAPI.breakCarriedTool(4);
    }
});

CreateWire("coilTin"      ,"Tin Coil"      ,{name:"coilTin"     ,meta:0},power(1),4);
CreateWire("coilCopper"   ,"Copper Coil"   ,{name:"coilCopper"  ,meta:0},power(2),4);
CreateWire("coilGold"     ,"Gold Coil"     ,{name:"coilGold"    ,meta:0},power(3),6);
CreateWire("coilSteel"    ,"Steel Coil"    ,{name:"coilSteel"   ,meta:0},power(4),6);
CreateWire("coilTungsten" ,"Tungsten Coil" ,{name:"coilTungsten",meta:0},power(5),8);

Callback.addCallback("PreLoaded",function(){
    // 合成
    Recipes.addShaped({id:ItemID.coilTin     ,count:2,data:0},[" a ","aba"," a "],["a",ItemID.stickTin     ,0,"b",5,-1]);
    Recipes.addShaped({id:ItemID.coilCopper  ,count:2,data:0},[" a ","aba"," a "],["a",ItemID.stickCopper  ,0,"b",5,-1]);
    Recipes.addShaped({id:ItemID.coilGold    ,count:2,data:0},[" a ","aba"," a "],["a",ItemID.stickGold    ,0,"b",5,-1]);
    Recipes.addShaped({id:ItemID.coilSteel   ,count:2,data:0},[" a ","aba"," a "],["a",ItemID.stickSteel   ,0,"b",5,-1]);
    Recipes.addShaped({id:ItemID.coilTungsten,count:2,data:0},[" a ","aba"," a "],["a",ItemID.stickTungsten,0,"b",5,-1]);

    // 线缆轧制机
    ETRecipe.addWiremillRecipe({id:ItemID.plateTin     ,count:1,data:0},{id:ItemID.coilTin     ,count:1,data:0});
    ETRecipe.addWiremillRecipe({id:ItemID.plateCopper  ,count:1,data:0},{id:ItemID.coilCopper  ,count:1,data:0});
    ETRecipe.addWiremillRecipe({id:ItemID.plateGold    ,count:1,data:0},{id:ItemID.coilGold    ,count:1,data:0});
    ETRecipe.addWiremillRecipe({id:ItemID.plateSteel   ,count:1,data:0},{id:ItemID.coilSteel   ,count:1,data:0});
    ETRecipe.addWiremillRecipe({id:ItemID.plateTungsten,count:1,data:0},{id:ItemID.coilTungsten,count:1,data:0});
});