defmodule Day11 do

  def power_level(x, y, serial) do
    rack_id = x + 10
    level = rack_id * (rack_id * y + serial)
    rem(div(level, 100), 10) - 5
  end

  def part1(serial) do
    top_lefts = for x <- 1..298, y <- 1..298, do: {x, y}
    top_lefts |> Enum.map(fn {x, y} -> find_power(x, y, 3, serial) end) |> Enum.max_by(fn {_, _, p} -> p end)
  end

  defp find_power(a, b, size, serial) do
    coords = for x <- a..(a+(size-1)), y <- b..(b+(size-1)), do: {x, y}
    total_power = coords |> Enum.reduce(0, fn {x, y}, sum -> sum + power_level(x, y, serial) end)
    {a, b, total_power}
  end

  defp create_power_map(coords, serial) do
    coords |> Enum.map(fn {x, y} -> {{x, y}, power_level(x, y, serial)} end) |> Map.new()
  end

  defp find_power_rec(a, b, size, serial, cache) do
    key = {a, b, size}
    cached = cache[key]
    if cached == nil do
      if rem(size, 2) == 0 do
        # even
        # split into four parts
        s2 = div(size, 2)
        {p1, c1} = find_power_rec(a,      b,      div(size, 2), serial, cache)
        {p2, c2} = find_power_rec(a + s2, b,      div(size, 2), serial, c1)
        {p3, c3} = find_power_rec(a,      b + s2, div(size, 2), serial, c2)
        {p4, c4} = find_power_rec(a + s2, b + s2, div(size, 2), serial, c3)
        sum = p1 + p2 + p3 + p4
        new_cache = Map.put(c4, key, sum)
        {sum, new_cache}
      else
        # odd
        if size == 1 do
          # don't put in cache, assuming memory access is more expensive than CPU
          {power_level(a, b, serial), cache}
        else
          # calculate edge
          edge_sum = b..(b+size-1) |> Enum.reduce(0, fn b_, sum -> sum + power_level(a, b_, serial) end)
          edge_sum = edge_sum + (a..(a+size-1) |> Enum.reduce(0, fn a_, sum -> sum + power_level(a_, b, serial) end))
          bottom_right_power = power_level(a+size-1, b+size-1, serial)
          edge_sum = edge_sum - bottom_right_power # remove bottom-right counted twice

          {even_power, c1} = find_power_rec(a, b, size - 1, serial, cache)
          this_power = even_power + edge_sum
          new_cache = Map.put(c1, key, this_power)
          {this_power, new_cache}
        end
      end
    else
      coords = for x <- a..(a+(size-1)), y <- b..(b+(size-1)), do: {x, y}
      total_power = coords |> Enum.reduce(0, fn {x, y}, sum -> sum + power_level(x, y, serial) end)
      new_cache = Map.put(cache, key, total_power)
      {total_power, new_cache}
    end
  end

  def part2(serial) do
    coords = for x <- 1..300, y <- 1..300, do: {x, y}
    #power_map = create_power_map(coords, serial)
    #(1..15) |> Enum.map(fn y ->
    #  IO.inspect (1..15 |> Enum.map(fn x -> power_level(x, y, serial) end))
    #end)
    result_cache = coords |> Enum.reduce(%{}, fn {x, y}, cache ->
      max_size = min(301 - x, 301 - y)
      {_, nc} = find_power_rec(x, y, max_size, serial, cache)
      nc
    end)
    {{a, b, size}, power} = result_cache |> Enum.max_by(fn {_, v} -> v end)
    {a, b, size, power}

    #{list, _} = coords |> Enum.map_reduce(cache, fn {x, y}, cache_ ->
    #  # for each point, generate a stream of results for each grid size
    #  max_size = min(5, min(301 - x, 301 - y))
    #  {size_power, _} = 1..max_size |> Enum.map_reduce(0, fn size, prev_power ->
    #    # generate for coords:
        # ..*
        # ..*
        # *** <- bottom right will be counted twice in the sum
        #power_sum = y..(y+size-1) |> Enum.reduce(0, fn y_, sum -> sum + power_level(x+size-1, y_, serial) end)
        #power_sum = power_sum + x..(x+size-1) |> Enum.reduce(0, fn x_, sum -> sum + power_level(x_, y+size-1, serial) end)
    #    power_sum = y..(y+size-1) |> Enum.reduce(0, fn y_, sum -> sum + power_map[{x+size-1, y_}] end)
    #    power_sum = power_sum + (x..(x+size-1) |> Enum.reduce(0, fn x_, sum -> sum + power_map[{x_, y+size-1}] end))
    #    bottom_right_power = power_level(x+size-1, y+size-1, serial)
    #    power_sum = power_sum - bottom_right_power # bottom-right counted twice
    #    this_power = power_sum + prev_power
    #    {{size, this_power}, this_power} # {result, accumulator}
    #  end)

    #  #IO.inspect size_power
    #  {size, power} = Enum.max_by(size_power, fn {_, power} -> power end)
    #  {x, y, size, power}
    #end)
    #list |> Enum.max_by(fn {_, _, _, p} -> p end)
  end
end
