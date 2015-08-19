;(function ($) {
    var fn = $.fn
    var $win = $(window)
    var $doc = $(document)

    var operators  = { max:true, min:true }
    var objects    = { window:true, device:true, element:true }
    var dimensions = { width:true, height:true }
    var keys       = {}
    
    for (var operator in operators) for (var dimension in dimensions) {
        keys[operator + '-' + dimension] = true
        for (var object in objects) keys[operator + '-' + object + '-' + dimension] = true
    }

    var $_gauge =
        $.gauge = function (arg) {
            switch (typeof arg) {
                case 'undefined':        arg = 'input[form=gauge]'
                case 'string':           arg = { selector: arg, ready: 'ready page:load pjax:success' }
                case 'object': var opt = arg
                break
                default: throw new TypeError
            }

            var selector = opt.selector

            $doc.on(opt.ready, function () {
                $(selector).each(function () {
                    var $this = $(this)
                    $this.attr({ form: 'gauge', type: 'checkbox' })
                    $this.prop('checked', $this.gauge()).trigger('change')
                })
            })

            $win.on('load resize', function (e) {
                $(selector).each(function () {
                    var $this = $(this)
                    var was = $this.prop('checked')
                    var now = $this.gauge()
                    if (was !== now) $this.prop('checked', now).trigger('change')
                })
            })

            $doc.on('change', selector, function () {
                var $control = $(this)
                var name = $control.val()
                var attr = 'class-' + name
                var sel = '[' + attr + ']'

                $control.parent().find(sel).addBack(sel).each(function () {
                    var $this = $(this)

                    if (! $this.attr('class-default'))
                        $this.attr('class-default', $this.attr('class'))
             
                    if ($control.is(':checked')) {
                        $this.attr('class', $this.attr(attr))
                        $this.data('gauge', name)
                    }

                    else if (name == $this.data('gauge')) {
                        $this.attr('class', $this.attr('class-default'))
                        $this.data('gauge', '')
                    }
                })
            })

            $doc.on('submit', function (event) {
                var $these = $(event.target).find(selector)
                $these.attr('disabled', 'disabled')
                setTimeout(function () { $these.attr('disabled', '') })
            })
        }

    var fn_gauge =
        fn.gauge = function () {
            var $this = $(this)
            var value, values = {}
            
            for (var key in keys) {
                if (value = $this.data(key)) values[key] = value
                if (value = $this.attr(key)) values[key] = value
            }

            return $this.parent().probe(values)
        }

    var fn_probe =
        fn.probe = function () {
            return fn_probe_dispatch[arguments.length].apply(this, arguments)
        }

    var fn_probe_dispatch = []

        fn_probe_dispatch[1] = function (data) {
            var answer = true
            for (var key in data) answer = answer && fn_probe_dispatch[2].call(this, key, data[key])
            return answer
        }

        fn_probe_dispatch[2] = function (key, limit) {
            var matched = key.match(/[A-Z]?[a-z]+/g)

            switch (matched.length) {
                case 2: matched.splice(1, 0, 'window')
                case 3: break
                default: return true
            }

            var operator  = matched[0]
            var object    = matched[1].toLowerCase()
            var dimension = matched[2].toLowerCase()

            if ('function' == typeof window.matchMedia) {
                switch (object) {
                    case 'window': var query = [operator,         dimension]; break
                    case 'device': var query = [operator, object, dimension]; break
                }
                if (query) return window.matchMedia('(' + query.join('-') + ':' + limit + ')').matches
            }
     
            switch (object) { case 'device': object = 'window' }

            if (! fn_probe_dispatch[object]) return true

            var value = fn_probe_dispatch[object].call(this, dimension)
            limit = parseInt(limit, 10) // Only `px` is currently supported.

            switch (operator) {
                case 'max': return value <= limit
                case 'min': return value >= limit
            }
        }

        fn_probe_dispatch['element'] = function (dimension) {
            return this['inner' + dimension[0].toUpperCase() + dimension.substr(1)]()
        }

        fn_probe_dispatch['window'] = function (dimension) {
            return fn_probe.element.call($win, dimension)
        }
})(jQuery);
