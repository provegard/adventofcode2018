defmodule Day11 do

  def power_level(x, y, serial) do
    rack_id = x + 10
    level = rack_id * (rack_id * y + serial)
    level = rem(div(level, 100), 10)
    level - 5
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

  def part2(serial) do
    coords = for x <- 1..300, y <- 1..300, do: {x, y}

    coords |> Enum.map(fn {x, y} ->

      # for each point, generate a stream of results for each grid size
      stream = Stream.unfold(%{:size => 1, :prev_power => 0}, fn %{:size => size, :prev_power => prev_power} ->
        if x + size > 301 do
          nil
        else
          # generate for coords:
          # ..#
          # ..#
          # ###
          y_edge_coords = for y_ <- y..(y+size-1), do: {x+size-1, y_}
          x_edge_coords = for x_ <- x..(x+size-2), do: {x_, y+size-1} # -2 do not count bottom-right corner twice
          all = x_edge_coords ++ y_edge_coords #|> Enum.uniq()
          #IO.inspect length(all)
          power_sum = all |> Enum.reduce(0, fn {x_, y_}, sum -> sum + power_level(x_, y_, serial) end)
          this_power = power_sum + prev_power
          stream_result = {size, this_power}
          next_acc = %{:size => size + 1, :prev_power => this_power}
          {stream_result, next_acc}
        end
      end)
      {size, power} = Enum.max_by(stream, fn {_, power} -> power end)
      #IO.inspect {size, power}
      {x, y, size, power}
    end) |> Enum.max_by(fn {_, _, _, p} -> p end)


    #1..300 |> Enum.to_list() |> Enum.map(fn size ->
    #  top_lefts = for x <- 1..(301-size), y <- 1..(301-size), do: {x, y}
    #  # find largest of this size
    #  {x, y, p} = top_lefts |> Enum.map(fn {x, y} -> find_power(x, y, size, serial) end) |> Enum.max_by(fn {_, _, p} -> p end)
    #  {x, y, size, p}
    #end) |> Enum.max_by(fn {_, _, _, p} -> p end)
  end
end
