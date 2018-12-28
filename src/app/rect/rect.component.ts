import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-rect',
    templateUrl: './rect.component.html',
    styleUrls: ['./rect.component.css']
})
export class RectComponent implements OnInit {

    isActive: Boolean = false;
    isMouseClicked: Boolean = false;
    isRotateBtnClicked: Boolean = false;

    corner: string;

    @ViewChild('shadow') shadow: ElementRef;


    rectStyles = {width: 300, height: 170, left: 200, top: 100, transform: 'rotate(0deg)'};
    shadowStyles = {...this.rectStyles};


    constructor() {
    }

    ngOnInit() {
    }

    onRotateBtnMouseDown() {
        this.isRotateBtnClicked = true;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e) {

        if (!this.isActive) {
            return;
        }
        let left, top;
        if (this.isMouseClicked) {

            switch (this.corner) {
                case 'top-left':
                    left = this.shadowStyles.width + this.shadowStyles.left;
                    top = this.shadowStyles.top + this.shadowStyles.height;
                    this.shadowStyles = {
                        ...this.shadowStyles,
                        left: e.pageX > left ? left : e.pageX,
                        top: e.pageY > top ? top : e.pageY,
                        width: this.getValue(this.shadowStyles.width - (e.pageX - this.shadowStyles.left)),
                        height: this.getValue(this.shadowStyles.height - (e.pageY - this.shadowStyles.top))
                    };
                    break;
                case 'top-right':
                    top = this.shadowStyles.top + this.shadowStyles.height;
                    this.shadowStyles = {
                        ...this.shadowStyles,
                        width: this.getValue(e.pageX - this.shadowStyles.left),
                        top: e.pageY > top ? top : e.pageY,
                        height: this.getValue(this.shadowStyles.height - (e.pageY - this.shadowStyles.top))
                    };
                    break;
                case 'bottom-right':
                    this.shadowStyles = {
                        ...this.shadowStyles,
                        width: this.getValue(e.pageX - this.shadowStyles.left),
                        height: this.getValue(e.pageY - this.shadowStyles.top)
                    };
                    break;
                case 'bottom-left':
                    left = this.shadowStyles.width + this.shadowStyles.left;
                    this.shadowStyles = {
                        ...this.shadowStyles,
                        left: e.pageX > left ? left : e.pageX,
                        height: this.getValue(e.pageY - this.shadowStyles.top),
                        width: this.getValue(this.shadowStyles.width - (e.pageX - this.shadowStyles.left)),
                    };

                    break;
            }

        } else if (this.isRotateBtnClicked) {
            const centerX = this.shadowStyles.left + (this.shadowStyles.width / 2);
            const centerY = (this.shadowStyles.top) + (this.shadowStyles.height / 2);
            const mouseX = e.pageX;
            const mouseY = e.pageY;
            const radians = Math.atan2(mouseX - centerX, mouseY - centerY);
            const degree = (radians * (180 / Math.PI) * -1) + 180;
            this.shadowStyles = {...this.shadowStyles, transform: `rotate(${degree}deg)`};

        }

    }

    getValue = (val) => {
        return val < 0 ? 0 : val;
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(e) {
        if (this.isActive && (this.isMouseClicked || this.isRotateBtnClicked)) {
            console.log('unclick');
            this.rectStyles = {...this.shadowStyles};
        }
        this.isMouseClicked = false;
        this.isRotateBtnClicked = false;

    }


    onMouseDown($event, corner) {
        this.isMouseClicked = true;
        this.corner = corner;
        // console.log(this.isMouseClicked, corner);
    }


}
