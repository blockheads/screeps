class PriorityQueue{
    
    constructor(){
        this.values = []
    }

    //helper method that swaps the values and two indexes of an array
    swap(index1, index2){
        let temp = this.values[index1];
        this.values[index1] = this.values[index2];
        this.values[index2] = temp;
        return this.values;
    }
    //helper methods that bubbles up values from end
    bubbleUp(){
        //get index of inserted element
        let index = this.values.length - 1
        //loop while index is not 0 or element no loger needs to bubble
        while(index > 0){
            //get parent index via formula
            let parentIndex = Math.floor((index - 1)/2);
            //if values is greater than parent, swap the two
            if(this.values[parentIndex].priority > this.values[index].priority){
                //swap with helper method
                this.swap(index, parentIndex);
                //change current index to parent index
                index = parentIndex;
            } else{
                break;
            }
        }
        return 0;
    }
    // method that pushes new value onto the end and calls the bubble helper
    push(value){
        this.values.push(value)
        //calculate parent, if parent is greater swap
        //while loop or recurse
        this.bubbleUp();
        return this.values
    }

    bubbleDown(){
        let parentIndex = 0;
        const length = this.values.length;
        const elementPriority = this.values[0].priority;
        //loop breaks if no swaps are needed
        while (true){
            //get indexes of child elements by following formula
            let leftChildIndex = (2 * parentIndex) + 1;
            let rightChildIndex = (2 * parentIndex) + 2;
            let leftChildPriority, rightChildPriority;
            let indexToSwap = null;
            // if left child exists, and is greater than the element, plan to swap with the left child index
            if(leftChildIndex < length){
                leftChildPriority = this.values[leftChildIndex].priority
                if(leftChildPriority < elementPriority){
                    indexToSwap = leftChildIndex;
                }
            }
            //if right child exists
            if(rightChildIndex < length){
                rightChildPriority = this.values[rightChildIndex].priority

                if(
                    //if right child is greater than element and there are no plans to swap
                    (rightChildPriority < elementPriority && indexToSwap === null) ||
                    //OR if right child is greater than left child and there ARE plans to swap
                    (rightChildPriority < leftChildPriority && indexToSwap !== null))
                {
                    //plan to swap with the right child
                    indexToSwap = rightChildIndex
                }
            }
            //if there are no plans to swap, break out of the loop
            if(indexToSwap === null){
                break;
            } 
            //swap with planned element
            this.swap(parentIndex, indexToSwap);
            //starting index is now index that we swapped with
            parentIndex = indexToSwap;
        }  
    }

    pop(){
        //swap first and last element
        this.swap(0, this.values.length - 1);
        //pop max value off of values
        let poppedNode = this.values.pop();
        //re-adjust heap if length is greater than 1
        if(this.values.length > 1){
            this.bubbleDown();
        }
        
        return poppedNode;
    }

    /**
     * Check's if the priority queue contains a particular node value
     * this should be moved out to be a funciton of a extended class
     * but... whatever...
     */
    hasRole(role){
        for(var i in this.values){
            if(this.values[i].value.role == role){
                return true;
            }
        }
        return false;
    }

      /**
     * Check's if the priority queue contains a particular node value,
     * if so it increments it
     * this should be moved out to be a funciton of a extended class
     * but... whatever...
     */
    // incrementRole(memory){
    //     for(var i in this.values){
    //         if(this.values[i].value == memory){
    //             this.values[i].amount = this.values[i].amount + 1;
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    empty(){
        //console.log("values length: ", this.values.length);
        //console.log("equal to 0? ", this.values.length == 0);
        return this.values.length == 0;
    }

    getList(){
        return this.values;
        
    }
}

module.exports = PriorityQueue;