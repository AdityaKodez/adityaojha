export const sceneCatalog = [
  {id:'ramen',name:'Ramen stall',module:'./ramen.js',builder:'buildRamen',number:'01',title:'After the rain.',description:'A warm bowl. A small shelter. Nowhere else to be.',label:'A miniature ramen stall with two diners, a cook, rising steam and falling rain.'},
  {id:'basketball',name:'Basketball',module:'./basketball.js',builder:'buildBasketball',number:'02',title:'One more game.',description:'Three friends. Half a court. The last light of the day.',label:'An isometric outdoor basketball court with a pass, a shot, a rebound and three friends.'},
  {id:'forest',ready:true,name:'Forest river',module:'./forest-river.js',builder:'buildForestRiver',number:'03',title:'By the river.',description:'Cold water, pine shade, and the long way home.',label:'A miniature forest river landscape with trees, a footbridge, a shelter and a visitor.'},
  {id:'coast',ready:true,name:'Coastal lighthouse',module:'./coastal-lighthouse.js',builder:'buildCoastalLighthouse',number:'04',title:'A light on the headland.',description:'Salt in the air. A small boat follows the shore.',label:'A miniature rocky coastal landscape with a lighthouse, a small boat and a sea inlet.'},
  {id:'station',ready:true,name:'Station',module:'./station.js',builder:'buildStation',number:'05',title:'The next stop.',description:'A quiet platform, a brief arrival, then the afternoon returns.',label:'A miniature station with a platform, waiting passengers and a train arriving and departing.'},
];

export async function loadScene(id) {
  const entry=sceneCatalog.find(scene=>scene.id===id);
  if(!entry) throw new Error(`Unknown scene: ${id}`);
  const module=await import(entry.module);
  const settings=module[entry.builder]();
  return {entry,settings};
}
