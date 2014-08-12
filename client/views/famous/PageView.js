var Surface = famous.core.Surface;
var View = famous.core.View;
var Transform = famous.core.Transform;
var StateModifier = famous.modifiers.StateModifier;
var HeaderFooter = famous.views.HeaderFooterLayout;
var RenderController = famous.views.RenderController;
var ImageSurface = famous.surfaces.ImageSurface;
var GenericSync = famous.inputs.GenericSync;

PageView = function() {
    View.apply(this, arguments);

    this._renderController = new RenderController();
    this._defaultTransition = "SlideLeft";
    this.transitions = {};

    for (i = 0; i < this._defaultTransitions.length; i++) {
        this.addTransition(this._defaultTransitions[i].name, this._defaultTransitions[i].transition)
    }

    _createBody.call(this);

    _setListeners.call(this);
};

PageView.prototype = Object.create(View.prototype);
PageView.prototype.constructor = PageView;

PageView.prototype.addTransition = function(name, transition) {
    this.transitions[name] = transition;
};

PageView.prototype.goTo = function(view, transition) {

    if (!transition) {
        transition = this._defaultTransition;
    }

    this._renderController.outTransformFrom(this.transitions[transition].outTransform);
    this._renderController.inTransformFrom(this.transitions[transition].inTransform);
    this._renderController.options.outTransition = this.transitions[transition].outTransition;
    this._renderController.options.inTransition = this.transitions[transition].inTransition;

    this._renderController.inOpacityFrom(function() { return 1; }); 
    this._renderController.outOpacityFrom(function() { return 1; });

    this._renderController.show(view);
};
PageView.DEFAULT_OPTIONS = { };

function _createBody() {  
    var backing = new Surface({
        properties: {
            backgroundColor: 'black',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }
    });

    this.add(backing);

    this.add(this._renderController);
}

function _setListeners() {
}

PageView.prototype._defaultTransitions = [
    {
        name: "SlideLeft",
        transition: {
            inTransition: {
                curve: 'easeInOut',
                duration: 300
            },
            outTransition: {
                curve: 'easeInOut',
                duration: 300
            },
            outTransform: function(progress) {
                return Transform.translate(window.innerWidth * progress - window.innerWidth, 0, 0);
            },
            inTransform: function(progress) {
                return Transform.translate(window.innerWidth * (1.0 - progress), 0, 0);
            }
        }
    }
];
