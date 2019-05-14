import Scope from '../../scope';
import ParentBlot from './parent';
export default class ContainerBlot extends ParentBlot {
    checkMerge() {
        return (this.next !== null && this.next.statics.blotName === this.statics.blotName);
    }
    deleteAt(index, length) {
        super.deleteAt(index, length);
        this.enforceAllowedChildren();
    }
    formatAt(index, length, name, value) {
        super.formatAt(index, length, name, value);
        this.enforceAllowedChildren();
    }
    insertAt(index, value, def) {
        super.insertAt(index, value, def);
        this.enforceAllowedChildren();
    }
    optimize(context) {
        super.optimize(context);
        if (this.children.length > 0 && this.next != null && this.checkMerge()) {
            this.next.moveChildren(this);
            this.next.remove();
        }
    }
}
ContainerBlot.blotName = 'container';
ContainerBlot.scope = Scope.BLOCK_BLOT;
