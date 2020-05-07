// 铜线圈
IDRegistry.genBlockID("coilCopper");
Block.createBlock("coilCopper",[
    {name:"Copper Coil",texture:[["copper_coil_bottom",0],["copper_coil_top",0],["copper_coil",0]],inCreative:true}
],"machine");

Callback.addCallback("PreLoaded",function(){
    Recipes.addShaped({id:BlockID.coilCopper,count:1,data:0},[
        "aaa",
        "aaa",
        "aaa"
    ],["a",ItemID.wireCopper,0]);
});

Block.registerDropFunction("coilCopper",function(){return [];});
Block.registerPlaceFunction("coilCopper",function(coords,item,block){
    var place = coords;
    if(!canTileBeReplaced(block.id,block.data)){
        place = coords.relative,block = World.getBlock(place.x,place.y,place.z);
        if(!canTileBeReplaced(block.id,block.data)) return;
    }

    World.setBlock(place.x,place.y,place.z,item.id,item.data);
    var tile = World.addTileEntity(place.x,place.y,place.z);
    if(item.extra) tile.defaultValues.durability = item.extra.getInt("durability");
});

Machine.registerPrototype(BlockID.coilCopper,{
    defaultValues:{durability:16384},

    breakDamage:function(damage){
        this.data.durability -= damage;
    },

    tick:function(){
        if(this.data.durability <= 0) this.selfDestroy();
    },

    destroy:function(){
        if(this.data.durability > 0){
            var extra = new ItemExtraData();
            extra.putInt("durability",this.data.durability);
            World.dropItem(this.x + 0.5,this.y,this.z + 0.5,0,this.id,1,0,extra);
        } else {
            World.drop(this.x + 0.5,this.y + 1,this.z + 0.5,0,ItemID.cellEmpty,1,0);
        }
    }
});

FusionReactor.registerModule(BlockID.coilCopper,function(coords,data,id){
    let heat = 3,fuel = 1;
    for(let side = 0;side < 6;side++){
        var relative = World.getRelativeCoords(coords.x,coords.y,coords.z,side);
        var id = World.getBlockID(relative.x,relative.y,relative.z);
        if(FusionReactor.getModuleType(id) == "Coil"){
            heat += 3,fuel += 1;
        }
    }
    data.heat += heat,data.fuel += fuel;
},"Coil");