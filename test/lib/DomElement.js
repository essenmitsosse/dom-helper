"use strict";

// invoces DOM environment
var expect = require( "chai" )
	.expect,
	spy = require( "sinon" )
	.spy,
	jsdom = require( "jsdom-global" ),
	DomElement = require( "../../lib/DomElement" ),
	DomElementList = require( "../../lib/DomElementList" ),
	domHelper = require( "../../simple-dom-helper" );

function getDomStub( width, height, x, y ) {
	return {
		offsetWidth: width,
		offsetHeight: height,
		getBoundingClientRect: function () {
			return {
				left: x,
				top: y
			}
		}
	};
}

beforeEach( function () {
	global.cleanup = jsdom()
} );

afterEach( function () {
	global.cleanup()
} );

describe( "DomElement", function () {
	beforeEach( function () {
		this.testDiv = document.createElement( "div" );
		this.$domElement = new DomElement( this.testDiv );
	} );

	it( "getHtmlElement returns the acutal DOM element", function () {
		var domElement = new DomElement( this.testDiv );

		expect( domElement.getHtmlElement() )
			.to.equal( this.testDiv );
	} );

	it( "if domElement is created twice from the same dom element it is the same object", function () {
		var domElement = new DomElement( this.testDiv ),
			anotherDomElement = new DomElement( this.testDiv );

		expect( domElement )
			.to.equal( anotherDomElement );
	} );

	describe( "DomElement size and position", function () {
		/* The following tests are actually bad, because we are checking for implementation. If the implementation is ever changed, these tests must be changed too. Right now this saves us the trouble of doing tests in an actual browser and at least we are making sure we get the values we are expecting. */
		it( "getSizeX returns the width of the DOM element", function () {
			var domElement = new DomElement( this.testDiv ),
				domStub = new DomElement( getDomStub( 100, 200, 300, 400 ) );

			/* JSDOM defaults to 0 for offsetWidth */
			expect( domElement.getSizeX() )
				.to.equal( 0 );

			expect( domStub.getSizeX() )
				.to.equal( 100 ); // check if offsetWidth of DOM element is used
		} );

		it( "getSizeY returns the height of the DOM element", function () {
			var domElement = new DomElement( this.testDiv ),
				domStub = new DomElement( getDomStub( 100, 200, 300, 400 ) );

			expect( domElement.getSizeY() )
				.to.equal( 0 ); // JSDOM defaults to 0 for offsetHeight

			expect( domStub.getSizeY() )
				.to.equal( 200 ); // check if offsetHeight of DOM element is used
		} );

		it( "getPosX returns the X-Pos of the DOM element", function () {
			var domElement = new DomElement( this.testDiv ),
				domStub = new DomElement( getDomStub( 100, 200, 300, 400 ) );

			expect( domElement.getPosX() )
				.to.equal( 0 ); // JSDOM defaults to 0 for offsetWidth

			expect( domStub.getPosX() )
				.to.equal( 300 ); // check if offsetHeight of DOM element is
		} );

		it( "getPosY returns the Y-Pos of the DOM element", function () {
			var domElement = new DomElement( this.testDiv ),
				domStub = new DomElement( getDomStub( 100, 200, 300, 400 ) );

			expect( domElement.getPosY() )
				.to.equal( 0 ); // JSDOM defaults to 0 for offsetWidth

			expect( domStub.getPosY() )
				.to.equal( 400 ); // check if offsetHeight of DOM element is
		} );
	} );

	describe( "Class handling", function () {
		describe( "DomElement adding classes with 'addClass'", function () {
			it( "adds class name to the element", function () {
				this.$domElement.addClass( "testClassName" );

				expect( this.testDiv.className )
					.to.equal( "testClassName" );
			} );

			it( "adds two class names to the element", function () {
				this.$domElement.addClass( "anothertestClassName moreTestClassName" );

				expect( this.testDiv.className )
					.to.equal( "anothertestClassName moreTestClassName" );
			} );

			it( "a class name that is already there isnt added again", function () {
				this.$domElement.addClass( "classNameThatIsAddedTwice" );
				this.$domElement.addClass( "classNameThatIsAddedTwice" );

				expect( this.testDiv.className )
					.to.equal( "classNameThatIsAddedTwice" );
			} );

			it( "a class name that is already there isnt added again, but a new one is", function () {
				this.$domElement.addClass( "testClassName" );
				this.$domElement.addClass( "anotherTestClassName" );

				expect( this.testDiv.className )
					.to.equal( "testClassName anotherTestClassName" );
			} );

			it( "a class name that is already there isnt added again, but a new one is, even when they are added at the same time", function () {
				this.$domElement.addClass( "testClassName" );
				this.$domElement.addClass( "testClassName anotherTestClassName" );

				expect( this.testDiv.className )
					.to.equal( "testClassName anotherTestClassName" );
			} );
		} );

		describe( "DomElement adding classes with 'addClasses'", function () {
			it( "adds class name to the element", function () {
				this.$domElement.addClasses( [ "testClassName" ] );

				expect( this.testDiv.className )
					.to.equal( "testClassName" );
			} );

			it( "adds two class names to the element", function () {
				this.$domElement.addClasses( [ "anothertestClassName", "moreTestClassName" ] );

				expect( this.testDiv.className )
					.to.equal( "anothertestClassName moreTestClassName" );
			} );

			it( "a class name that is already there isnt added again", function () {
				this.$domElement.addClasses( [ "classNameThatIsAddedTwice" ] );
				this.$domElement.addClasses( [ "classNameThatIsAddedTwice" ] );

				expect( this.testDiv.className )
					.to.equal( "classNameThatIsAddedTwice" );
			} );

			it( "a class name that is already there isnt added again, but a new one is", function () {
				this.$domElement.addClasses( [ "testClassName" ] );
				this.$domElement.addClasses( [ "anotherTestClassName" ] );

				expect( this.testDiv.className )
					.to.equal( "testClassName anotherTestClassName" );
			} );

			it( "a class name that is already there isnt added again, but a new one is, even when they are added at the same time", function () {
				this.$domElement.addClasses( [ "testClassName" ] );
				this.$domElement.addClasses( [ "testClassName", "anotherTestClassName" ] );

				expect( this.testDiv.className )
					.to.equal( "testClassName anotherTestClassName" );
			} );
		} );

		describe( "DomElement removing classes with 'removeClass'", function () {
			it( "removes class name from an element", function () {
				this.$domElement.addClass( "testClassNameToBeRemoved" );
				this.$domElement.removeClass( "testClassNameToBeRemoved" );

				expect( this.testDiv.className )
					.to.equal( "" );
			} );

			it( "removes class name from an element but leaves all other class names", function () {
				this.$domElement.addClass( "classNameNotToBeRemoved testClassNameToBeRemoved" );
				this.$domElement.removeClass( "testClassNameToBeRemoved" );

				expect( this.testDiv.className )
					.to.equal( "classNameNotToBeRemoved" );
			} );

			it( "does nothing if the class name doesn’t exists", function () {
				this.$domElement.addClass( "classNameNotToBeRemoved" );
				this.$domElement.removeClass( "nonExistingClassName" );

				expect( this.testDiv.className )
					.to.equal( "classNameNotToBeRemoved" );
			} );

			it( "removes more then one class name at once", function () {
				this.$domElement.addClass( "classNameNotToBeRemoved testClassNameToBeRemoved anotherClassNameToBeRemoved" );
				this.$domElement.removeClass( "testClassNameToBeRemoved anotherClassNameToBeRemoved" );

				expect( this.testDiv.className )
					.to.equal( "classNameNotToBeRemoved" );
			} );
		} );

		describe( "DomElement removing classes with 'removeClasses'", function () {
			it( "removes class name from an element", function () {
				this.$domElement.addClass( "testClassNameToBeRemoved" );
				this.$domElement.removeClasses( [ "testClassNameToBeRemoved" ] );

				expect( this.testDiv.className )
					.to.equal( "" );
			} );

			it( "removes class name from an element but leaves all other class names", function () {
				this.$domElement.addClass( "classNameNotToBeRemoved testClassNameToBeRemoved" );
				this.$domElement.removeClasses( [ "testClassNameToBeRemoved" ] );

				expect( this.testDiv.className )
					.to.equal( "classNameNotToBeRemoved" );
			} );

			it( "does nothing if the class name doesn’t exists", function () {
				this.$domElement.addClass( "classNameNotToBeRemoved" );
				this.$domElement.removeClasses( [ "nonExistingClassName" ] );

				expect( this.testDiv.className )
					.to.equal( "classNameNotToBeRemoved" );
			} );

			it( "removes more then one class name at once", function () {
				this.$domElement.addClass( "classNameNotToBeRemoved testClassNameToBeRemoved anotherClassNameToBeRemoved" );
				this.$domElement.removeClasses( [ "testClassNameToBeRemoved", "anotherClassNameToBeRemoved" ] );

				expect( this.testDiv.className )
					.to.equal( "classNameNotToBeRemoved" );
			} );
		} );

		describe( "check if class exists on DomElement with 'hasClass'", function () {
			it( "returns FALSE if className doesn’t exists", function () {
				expect( this.$domElement.hasClass( "nonExistingClassName" ) )
					.to.equal( false );
			} );

			it( "returns TRUE if className does exists", function () {
				this.$domElement.addClass( "existingClassName" );

				expect( this.$domElement.hasClass( "existingClassName" ) )
					.to.equal( true );
			} );

			it( "returns TRUE if className does exists, even when there are several class names", function () {
				this.$domElement.addClass( "aClassName existingClassName anotherClassName" );

				expect( this.$domElement.hasClass( "existingClassName" ) )
					.to.equal( true );
			} );
		} );
	} );

	describe( "getting and setting attributes with", function () {

		describe( "'setAttribute' should", function () {
			it( "change an attribute", function () {
				this.$domElement.setAttribute( "testAttribute", "testValue" );

				expect( this.testDiv.getAttribute( "testAttribute" ) )
					.to.equal( "testValue" );
			} );

			it( "overrides an existing attribute", function () {
				this.testDiv.setAttribute( "testAttribute", "firstValue" );
				this.$domElement.setAttribute( "testAttribute", "latestValue" );

				expect( this.testDiv.getAttribute( "testAttribute" ) )
					.to.equal( "latestValue" );
			} );

			it( "change the innerHTML if the attribute name is 'text'", function () {
				this.$domElement.setAttribute( "text", "<b>HTML</b> Content" );

				expect( this.testDiv.innerHTML )
					.to.equal( "<b>HTML</b> Content" );
			} );

			it( "override the innerHTML if the attribute name is 'text'", function () {
				this.testDiv.innerHTML = "existing HTML Content";
				this.$domElement.setAttribute( "text", "<b>HTML</b> Content" );

				expect( this.testDiv.innerHTML )
					.to.equal( "<b>HTML</b> Content" );
			} );
		} );
		describe( "'getAttribute' should", function () {
			it( "get the value of the given attribute", function () {
				this.testDiv.setAttribute( "testAttribute", "testValue" );

				expect( this.$domElement.getAttribute( "testAttribute" ) )
					.to.equal( "testValue" );
			} );

			it( "returns 'null' if the attribute doesn’t exist", function () {
				expect( this.$domElement.getAttribute( "nonExistingAttribute" ) )
					.to.equal( null );
			} );

			it( "return an attribute set with 'setAttribute'", function () {
				this.$domElement.setAttribute( "testAttribute", "testValue" );

				expect( this.$domElement.getAttribute( "testAttribute" ) )
					.to.equal( "testValue" );
			} );

			it( "return the innerHTML if the attribute name is 'text'", function () {
				this.testDiv.innerHTML = "<b>HTML</b> Content";

				expect( this.$domElement.getAttribute( 'text' ) )
					.to.equal( "<b>HTML</b> Content" );
			} );
		} );
		describe( "'setAttributes' should", function () {
			beforeEach( function () {
				this.spy = spy( this.$domElement, "setAttribute" );

				this.$domElement.setAttributes( {
					"testAttribute1": "testValue1",
					"testAttribute2": "testValue2"
				} );
			} );

			it( "call 'setAttribute' for each argument", function () {
				expect( this.spy.callCount )
					.to.equal( 2 );
			} );

			it( "set attributes passed as an object", function () {

				expect( this.testDiv.getAttribute( "testAttribute1" ) )
					.to.equal( "testValue1" );
				expect( this.testDiv.getAttribute( "testAttribute2" ) )
					.to.equal( "testValue2" );
			} );

			it( "remove attribute if the value is false", function () {
				this.testDiv.setAttribute( "removedAttribute", "testValue" );

				this.$domElement.setAttributes( {
					"removedAttribute": false
				} );

				expect( this.testDiv.getAttribute( 'removedAttribute' ) )
					.to.equal( null );
			} );
		} );
		describe( "'removeAttribute' should", function () {
			it( "remove an existing attribute", function () {
				this.testDiv.setAttribute( "removedAttribute", "value" );

				this.$domElement.removeAttribute( "removedAttribute" );

				expect( this.testDiv.getAttribute( 'removedAttribute' ) )
					.to.equal( null );
			} );
		} );

		describe( "'html' should", function () {
			it( "replace the innerHTML", function () {
				this.$domElement.html( "<b>HTML</b> Content" );

				expect( this.testDiv.innerHTML )
					.to.equal( "<b>HTML</b> Content" );
			} );
		} );

		describe( "Saving and Getting", function () {
			it( "'save' should save data that can be returned with 'get'", function () {
				this.$domElement.save( "testData", "testDataContent" );

				expect( this.$domElement.get( "testData" ) )
					.to.equal( "testDataContent" );
			} );

			it( "should also work with objects and arrays", function () {
				var testObject = {
					"foo": "bar"
				};

				this.$domElement.save( "testData", testObject );

				expect( this.$domElement.get( "testData" ) )
					.to.equal( testObject );
			} );

			it( "should be able to recover data when new domElement ist created from same dom element", function () {
				this.$domElement.save( "testData", "testDataContent" );

				var $sameDomElement = new DomElement( this.testDiv );

				expect( $sameDomElement.get( "testData" ) )
					.to.equal( "testDataContent" );
			} );
		} );
		describe( "Styling", function () {
			describe( "'style' should", function () {
				it( "add css styles to the element", function () {
					this.$domElement.style( {
						"color": "red"
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "color:red" );
				} );

				it( "override existing styles on elements", function () {
					this.testDiv.setAttribute( "style", "color:green" );

					this.$domElement.style( {
						"color": "red"
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "color:red" );
				} );

				it( "remove styles if 'false' is passed as a value", function () {
					this.testDiv.setAttribute( "style", "color:green" );

					this.$domElement.style( {
						"color": false
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "" );
				} );

				it( "keep styles that are not changed", function () {
					this.testDiv.setAttribute( "style", "color:green;font-size:12px" );

					this.$domElement.style( {
						"font-size": false,
						"text-align": "left"
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "color:green;text-align:left" );
				} );
			} );
			describe( "'styleForce' should", function () {
				it( "add css styles to the element", function () {
					this.$domElement.styleForce( {
						"color": "red"
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "color:red" );
				} );

				it( "add several css styles to the element", function () {
					this.$domElement.styleForce( {
						"color": "red",
						"font-size": "12px"
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "color:red;font-size:12px" );
				} );

				it( "override existing styles on elements", function () {
					this.testDiv.setAttribute( "style", "color:green" );

					this.$domElement.styleForce( {
						"color": "red"
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "color:red" );
				} );

				it( "dont add styles if 'false' is passed as a value", function () {
					this.$domElement.styleForce( {
						"color": "red",
						"font-size": false
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "color:red" );
				} );

				it( "remove all existing styles if no new values are passed", function () {
					this.testDiv.setAttribute( "style", "color:green" );

					this.$domElement.styleForce( {
						"font-size": "12px"
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "font-size:12px" );
				} );

				it( "allows objects to be passed as a value", function () {
					this.$domElement.styleForce( {
						"transform": {
							"scale": 3,
							"translate": [ "10px", "50px" ],
							"rotate": "10deg",
							"skew": [ "10deg", "20deg" ]
						}
					} );

					expect( this.testDiv.getAttribute( "style" ) )
						.to.equal( "transform:scale(3)translate(10px,50px)rotate(10deg)skew(10deg,20deg)" );
				} );
			} );
		} );
	} );
	describe( "Getting Children", function () {

		beforeEach( function () {
			this.childDiv1 = document.createElement( "div" );
			this.childDiv2 = document.createElement( "div" );

			this.testDiv.appendChild( this.childDiv1 );
			this.testDiv.appendChild( this.childDiv2 );
		} );

		describe( "getElementById should", function () {
			it( "not exist", function () {
				expect( this.$domElement.getElementById )
					.to.equal( undefined );
			} );
		} );

		describe( "getElementByClassName should", function () {
			it( "get the first element with the given class name", function () {
				this.childDiv1.className = "classNameToBeLookingFor anotherClassName";
				this.childDiv2.className = "classNameToBeLookingFor anotherClassName";

				expect( this.$domElement.getElementByClassName( "classNameToBeLookingFor" )
						.getHtmlElement() )
					.to.equal( this.childDiv1 );

				expect( this.$domElement.getElementByClassName( "classNameToBeLookingFor" )
						.getHtmlElement() )
					.to.not.equal( this.childDiv2 );
			} );

			it( "return 'false' if no element is found", function () {
				expect( this.$domElement.getElementByClassName( "nonExistingClassName" ) )
					.to.equal( false );
			} );
		} );

		describe( "getElementByTagName should", function () {
			it( "get the first element with the given tag name", function () {

				expect( this.$domElement.getElementByTagName( "div" )
						.getHtmlElement() )
					.to.equal( this.childDiv1 );

				expect( this.$domElement.getElementByTagName( "div" )
						.getHtmlElement() )
					.to.not.equal( this.childDiv2 );
			} );

			it( "return 'false' if no element is found", function () {
				expect( this.$domElement.getElementByTagName( "nonExistingTagName" ) )
					.to.equal( false );
			} );
		} );

		describe( "domElement Lists", function () {
			describe( "should return a list of all elements", function () {
				it( "getElementsByClassName", function () {
					var $domElementList;

					this.childDiv1.className = "classNameToBeLookingFor anotherClassName";
					this.childDiv2.className = "classNameToBeLookingFor anotherClassName";

					$domElementList = this.$domElement.getElementsByClassName( "classNameToBeLookingFor" );

					expect( $domElementList.getList() )
						.to.be.an( 'array' );

					expect( $domElementList.getList()[ 0 ].getHtmlElement() )
						.to.equal( this.childDiv1 );

					expect( $domElementList.getList()[ 1 ].getHtmlElement() )
						.to.equal( this.childDiv2 );
				} );

				it( "getElementsByTagName", function () {
					var $domElementList;

					$domElementList = this.$domElement.getElementsByTagName( "div" );

					expect( $domElementList.getList() )
						.to.be.an( 'array' );

					expect( $domElementList.getList()[ 0 ].getHtmlElement() )
						.to.equal( this.childDiv1 );

					expect( $domElementList.getList()[ 1 ].getHtmlElement() )
						.to.equal( this.childDiv2 );
				} );
			} );
		} );
	} );

	describe( "'remove'", function () {
		it( "removes object from DOM", function () {
			var childDiv1 = document.createElement( "div" ),
				$childDiv1 = domHelper.createFromElement( childDiv1 );

			this.testDiv.appendChild( childDiv1 );

			expect( this.testDiv.childElementCount )
				.to.equal( 1 );

			$childDiv1.remove();

			expect( this.testDiv.childElementCount )
				.to.equal( 0 );
		} );

		it( "does nothing if object has no parent/is not part of the DOM", function () {
			var noParentDiv = document.createElement( "div" ),
				$noParentDiv = domHelper.createFromElement( noParentDiv );

			expect( $noParentDiv.remove() )
				.to.not.throw;
		} );

		it( "if object is added again to the DOM after removal, it is still cached", function () {
			var childDiv1 = document.createElement( "div" ),
				$childDiv1 = domHelper.createFromElement( childDiv1 );

			this.testDiv.appendChild( childDiv1 );
			$childDiv1.remove();
			this.testDiv.appendChild( childDiv1 );

			expect( this.$domElement.getElementByTagName( "div" ) )
				.to.equal( $childDiv1 );

		} );
	} );

	describe( "'append' should", function () {
		it( "append the given element to this element as a child", function () {
			var $newChildDomElement = domHelper.create( "div" );

			this.$domElement.append( $newChildDomElement );

			expect( $newChildDomElement.getHtmlElement()
					.parentElement )
				.to.equal( this.$domElement.getHtmlElement() );
		} );
	} );

	describe( "'appendList' should", function () {
		it( "append all given elements to this element as a children", function () {
			var $newChildDomElement = domHelper.create( "div" ),
				$anotherNewChildDomElement = domHelper.create( "div" );

			this.$domElement.appendList( [ $newChildDomElement, $anotherNewChildDomElement ] );

			expect( $newChildDomElement.getHtmlElement()
					.parentElement )
				.to.equal( this.$domElement.getHtmlElement() );

			expect( $anotherNewChildDomElement.getHtmlElement()
					.parentElement )
				.to.equal( this.$domElement.getHtmlElement() );
		} );
	} );

	describe( "'parent' should", function () {
		it( "return the parent DomElement", function () {
			var $newChildDomElement = domHelper.create( "div" );

			this.$domElement.getHtmlElement()
				.appendChild( $newChildDomElement.getHtmlElement() );

			expect( $newChildDomElement.parent()
					.getHtmlElement() )
				.to.equal( this.$domElement.getHtmlElement() );
		} );

		it( "return the parent DomElement, even after it has been moved", function () {
			var $newChildDomElement = domHelper.create( "div" ),
				$newParentDomElement = domHelper.create( "div" );

			this.$domElement.getHtmlElement()
				.appendChild( $newChildDomElement.getHtmlElement() );

			$newParentDomElement.getHtmlElement()
				.appendChild( $newChildDomElement.getHtmlElement() );

			expect( $newChildDomElement.parent()
					.getHtmlElement() )
				.to.equal( $newParentDomElement.getHtmlElement() );
		} );

		it( "return 'null' if there is no parent", function () {
			var $newDomElementWithoutParent = domHelper.create( "div" );

			expect( $newDomElementWithoutParent.parent() )
				.to.equal( null );
		} );

		it( "return 'document' if the parent is the document itself", function () {
			var $bodyElement = domHelper.createFromElement( document.getElementsByTagName( "html" )[ 0 ] );

			expect( $bodyElement.parent()
					.getHtmlElement() )
				.to.equal( document );
		} );
	} );

	describe( "'children' should", function () {
		it( "return a DomElementList of all children DomElements", function () {
			var $newChildDomElement = domHelper.create( "div" ),
				$anotherNewChildDomElement = domHelper.create( "div" ),
				$list;

			this.$domElement.getHtmlElement()
				.appendChild( $newChildDomElement.getHtmlElement() );
			this.$domElement.getHtmlElement()
				.appendChild( $anotherNewChildDomElement.getHtmlElement() );

			$list = this.$domElement.children();

			expect( $list instanceof DomElementList )
				.to.equal( true );

			expect( $list.getList()[ 0 ] )
				.to.equal( $newChildDomElement );

			expect( $list.getList()[ 1 ] )
				.to.equal( $anotherNewChildDomElement );

		} );

		it( "return a empty DomElementList if there are no children", function () {
			var $list;

			$list = this.$domElement.children();

			expect( $list instanceof DomElementList )
				.to.equal( true );

			expect( $list.getList()
					.length )
				.to.equal( 0 );

		} );
	} );

	it( "should throw, if a DomElement is passed as an argument", function () {
		var $domElement;

		expect( function () {
				$domElement = domHelper.createFromElement( domHelper.create( "div" ) )
			} )
			.to.throw();
	} )
} );
