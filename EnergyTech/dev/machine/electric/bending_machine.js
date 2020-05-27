// [卷板机]Bending Machine
IDRegistry.genBlockID("bendingMachine");
Block.createBlock("bendingMachine",[
    {name:"Bending Machine",texture:[["machine_bottom",1],["bending_machine_top",0],["machine_side",1],["bending_machine",0],["machine_side",1],["machine_side",1]],inCreative:true}
],"machine");
TileRenderer.setStandartModel(BlockID.bendingMachine,[["machine_bottom",1],["bending_machine_top",0],["machine_side",1],["bending_machine",0],["machine_side",1],["machine_side",1]]);
TileRenderer.registerRotationModel(BlockID.bendingMachine,0,[["machine_bottom",1],["bending_machine_top",0],["machine_side",1],["bending_machine",0],["machine_side",1],["machine_side",1]]);
TileRenderer.registerRotationModel(BlockID.bendingMachine,4,[["machine_bottom",1],["bending_machine_top",1],["machine_side",1],["bending_machine",0],["machine_side",1],["machine_side",1]]);
TileRenderer.registerRotationModel(BlockID.bendingMachine,8,[["machine_bottom",1],["bending_machine_top",1],["machine_side",1],["bending_machine",1],["machine_side",1],["machine_side",1]]);

MachineRegistry.setDrop("bendingMachine",BlockID.machineCasing,1);
Callback.addCallback("PreLoaded",function(){
	Recipes.addShaped({id:BlockID.bendingMachine,count:1,data:0},[
        "aba",
        "dcd",
        "aba"
    ],["a",ItemID.plateIron,0,"b",ItemID.circuit,0,"c",BlockID.machineCasing,1,"d",BlockID.compressor,0]);
});

var GuiBendingMachine = new UI.StandartWindow({
    standart:{
        header:{text:{text:Translation.translate("Bending Machine")}},
        inventory:{standart:true},
        background:{standart:true}
    },
    
    drawing:[
        {type:"bitmap",x:900,y:325,bitmap:"logo",scale:GUI_SCALE},
        {type:"bitmap",x:350,y:50,bitmap:"energy_background",scale:GUI_SCALE},
        {type:"bitmap",x:600,y:175 + GUI_SCALE * 2,bitmap:"arrow_background",scale:GUI_SCALE},
		{type:"bitmap",x:700 - GUI_SCALE * 4,y:75 - GUI_SCALE * 4,bitmap:"infoSmall",scale:GUI_SCALE}
    ],

    elements:{
        "slotInput":{type:"slot",x:350 + GUI_SCALE * 43,y:175,bitmap:"slot_empty",scale:GUI_SCALE},
        "scaleArrow":{type:"scale",x:600,y:175 + GUI_SCALE * 2,direction:0,value:0.5,bitmap:"arrow_scale",scale:GUI_SCALE},
        "slotOutput":{type:"slot",x:720,y:175,bitmap:"slot_empty",scale:GUI_SCALE,isValid:function(){return false;}},
        "textEnergy":{type:"text",font:GUI_TEXT,x:700,y:75,width:300,height:TEXT_SIZE,text:Translation.translate("Energy: ") + "0/0Eu"},
        "scaleEnergy":{type:"scale",x:350 + GUI_SCALE * 6,y:50 + GUI_SCALE * 6,direction:1,value:0.5,bitmap:"energy_scale",scale:GUI_SCALE},

        "slotUpgrade1":{type:"slot",x:370,y:325,bitmap:"slot_circuit",isValid:UpgradeRegistry.isValidUpgrade},
		"slotUpgrade2":{type:"slot",x:430,y:325,bitmap:"slot_circuit",isValid:UpgradeRegistry.isValidUpgrade},
		"slotUpgrade3":{type:"slot",x:490,y:325,bitmap:"slot_circuit",isValid:UpgradeRegistry.isValidUpgrade},
        "slotUpgrade4":{type:"slot",x:550,y:325,bitmap:"slot_circuit",isValid:UpgradeRegistry.isValidUpgrade}
    }
});

MachineRegistry.registerEUMachine(BlockID.bendingMachine,{
    defaultValues:{
        meta:0,
        tier:2,
        progress:0,
        work_time:320,
        isActive:false,
        energy_consumption:4
    },

    upgrades:["energyStorage","overclocker","transformer"],
    
	initValues:function(){
        this.data.tier = this.defaultValues.tier;
        this.data.work_time = this.defaultValues.work_time;
        this.data.sound_volume = this.defaultValues.sound_volume;
        this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
	},

	tick:function(){
        this.renderer();
		UpgradeRegistry.executeUpgrades(this);
        StorageInterface.checkHoppers(this);

        var input = this.container.getSlot("slotInput");
        var recipe = RecipeRegistry.getRecipeResult("BendingMachine",[input.id,input.data]);
        
        if(recipe && input.count >= recipe.count){
            if(this.data.energy >= this.data.energy_consumption){
                this.data.energy -= this.data.energy_consumption;
                this.data.progress += 1 / this.data.work_time;
                this.activate();
                if(this.data.progress.toFixed(3) >= 1){
                    var output = recipe.output;
                    this.setOutputSlot("slotOutput",output.id,output.count,output.data),input.count -= recipe.count;
                    this.container.validateAll();
                    this.data.progress = 0;
                }
            } else this.deactive();
        } else {
            this.data.progress = 0;
            this.deactive();
        }
        
        this.container.setScale("scaleArrow",parseInt(this.data.progress / 1 * 22) / 22);
        this.container.setScale("scaleEnergy",parseInt(this.data.energy / this.getEnergyStorage() * 47) / 47);
        this.container.setText("textEnergy",Translation.translate("Energy: ") + this.data.energy + "/" + this.getEnergyStorage() + "Eu");
    },

    renderer:function(){
        TileRenderer.mapAtCoords(this.x,this.y,this.z,this.id,this.data.meta + (this.data.isActive?4 * (parseInt(this.data.progress / 1 * 2 * 10)%2) + 4:0));
    },

    getGuiScreen:function(){
        return GuiBendingMachine;
    },

    energyReceive:MachineRegistry.energyReceive
});
TileRenderer.setRotationPlaceFunction(BlockID.bendingMachine);
StorageInterface.createInterface(BlockID.bendingMachine,{
	slots:{
		"slotInput":{input:true},
        "slotOutput":{output:true}
	},
	isValidInput:function(item){
		return RecipeRegistry.getRecipeResult("BendingMachine",[item.id,item.data])?true:false;
	}
});