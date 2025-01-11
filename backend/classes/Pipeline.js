import Component from './Component.js'

class Pipeline {
    constructor(fetchedPipelineData) {
      this.name=fetchedPipelineData.name;
      this.base_file=fetchedPipelineData.base_file;
      this.components = [];
      fetchedPipelineData.components.forEach((component) => {
        this.components.push(component);
      });
    };

    add_component(component, position) {
        const index = position - 1;
        if (index >= this.components.length) {
          this.components.push(component);
        } else {
          this.components.splice(index, 0,component);
        }
        // for (let i=index; i<this.components.length;i++){
        //     this.components[i].execute();
        // }
      }
      
      delete_component(position) {
      const index = position - 1;
      if (index >= 0 && index < this.components.length) {
        this.components.splice(index, 1);
  
        // for (let i = index; i < this.components.length; i++) {
        //   this.components[i].execute();
        // }
      }
    }
    
      update_component(component, position) {
      const index = position - 1;
      if (index >= 0 && index < this.components.length) {
        this.components[index] = component;
    
        // for (let i = index; i < this.components.length; i++) {
        //   this.components[i].execute();
        // }
      }
    }

    move_component(movable_position, new_position) {
    const index1 = movable_position - 1;
    const index2 = new_position - 1;

    if (index1 >= 0 && index1 < this.components.length && index2 >= 0 && index2 < this.components.length) {
      const componentToMove = this.components.splice(index1, 1)[0];

      this.components.splice(index2, 0, componentToMove);

      // const startIndex = Math.min(index1, index2);
      // for (let i = startIndex; i < this.components.length; i++) {
      //   this.components[i].execute();
      // }
    }
  }

    get_as_JSON(){
        return {
            name: this.name,
            base_file: this.base_file,
            components: this.components.map((component) => component.get_as_JSON()),
          }
    }
  }


export default Pipeline;